<template>
  <div
    data-slot="empty-state"
    :class="
      cn(
        'relative mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-dashed border-base-400 bg-base-0 px-6 py-12 text-center',
        props.class,
      )
    "
  >
    <NIconBlob :icon="icon" :tone="tone" shape="blob-2" class="size-20" />
    <h2 class="font-display mt-5 text-2xl font-semibold text-forest-900">{{ title }}</h2>
    <p v-if="$slots.default" class="mt-3 max-w-md text-base-550"><slot /></p>
    <div v-if="$slots.actions" class="mt-6 flex flex-wrap justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/** "Nothing here yet" panel — what production shows where TODO_CONTENT lists would be. */
const props = withDefaults(
  defineProps<{ icon: IconName; title: string; tone?: Tone; class?: HTMLAttributes["class"] }>(),
  { tone: "mint" },
);
</script>
