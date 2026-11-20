<template>
  <span
    data-slot="icon-blob"
    :class="cn('relative inline-flex size-16 shrink-0 items-center justify-center', props.class)"
    aria-hidden="true"
  >
    <span :class="cn('absolute inset-0', TONE_CLASSES[tone].mid)" :style="maskStyle(shape)" />
    <NIcon
      :name="icon"
      weight="duotone"
      size="55%"
      :class="cn('relative', TONE_CLASSES[tone].ink)"
    />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { IconName } from "~/utils/icons";
import { TONE_CLASSES, type Tone } from "~/utils/tones";
import { maskStyle, type MaskName } from "../blob-image/mask-paths";

/** A pastel blob behind a duotone Phosphor icon (BrightPath). Decorative — pair with visible text. */
const props = withDefaults(
  defineProps<{
    icon: IconName;
    tone?: Tone;
    shape?: Extract<MaskName, "blob-1" | "blob-2" | "blob-3" | "blob-4">;
    class?: HTMLAttributes["class"];
  }>(),
  { tone: "mint", shape: "blob-3" },
);
</script>
