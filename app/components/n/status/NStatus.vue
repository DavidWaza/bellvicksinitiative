<template>
  <span
    data-slot="status"
    :class="
      cn(
        'inline-flex items-center rounded-full border font-bold whitespace-nowrap',
        STATUS_SIZES[size],
        palette.bg,
        palette.bd,
        palette.fg,
        props.class,
      )
    "
  >
    <span aria-hidden="true" :class="cn('size-1.5 rounded-full', palette.dot)" />
    {{ entry.label }}
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  CAUSE_STATUS_REGISTRY,
  resolveCauseStatus,
  STATUS_SIZES,
  STATUS_TONE_PALETTE,
  type StatusSize,
} from "~/utils/status";

/** `<NStatus :status="cause.status" />` — registry + resolver + palette, never a v-if chain (§5.1). */
const props = withDefaults(
  defineProps<{
    /** Canonical or raw backend string. */
    status: string;
    kind?: "cause";
    size?: StatusSize;
    class?: HTMLAttributes["class"];
  }>(),
  { kind: "cause", size: "sm" },
);

const entry = computed(() => CAUSE_STATUS_REGISTRY[resolveCauseStatus(props.status)]);
const palette = computed(() => STATUS_TONE_PALETTE[entry.value.tone]);
</script>
