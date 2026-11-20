<template>
  <div data-slot="progress" :class="cn('flex flex-col gap-2', props.class)">
    <ProgressRoot
      :model-value="percent"
      :max="100"
      :aria-label="ariaLabel"
      :aria-valuetext="valueText"
      class="relative h-2.5 w-full overflow-hidden rounded-full bg-accent-100"
    >
      <ProgressIndicator
        class="h-full rounded-full bg-accent-500 transition-[width] duration-700 ease-out"
        :style="{ width: `${percent}%` }"
      />
    </ProgressRoot>
    <div class="flex items-baseline justify-between gap-3 text-sm">
      <span class="text-base-550">
        Raised <strong class="font-bold text-base-900">{{ formatMoney(raised, currency) }}</strong>
      </span>
      <span class="text-base-550">
        Goal <strong class="font-bold text-base-900">{{ formatMoney(goal, currency) }}</strong>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { formatMoney, type Currency } from "~/utils/format-money";

/** Raised / goal bar with an accessible label. Only mount it with real numbers (see NTodo). */
const props = withDefaults(
  defineProps<{
    raised: number;
    goal: number;
    currency?: Currency;
    /** What is being funded, e.g. "Clean water for Lokoja". */
    label: string;
    class?: HTMLAttributes["class"];
  }>(),
  { currency: "NGN" },
);

const percent = computed(() =>
  props.goal > 0 ? Math.min(100, Math.round((props.raised / props.goal) * 100)) : 0,
);
const ariaLabel = computed(() => `Funding progress for ${props.label}`);
const valueText = computed(
  () =>
    `${percent.value}% funded: ${formatMoney(props.raised, props.currency)} of ${formatMoney(props.goal, props.currency)}`,
);
</script>
