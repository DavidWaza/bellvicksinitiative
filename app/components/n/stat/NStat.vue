<template>
  <div data-slot="stat" :class="cn('flex items-center gap-4', props.class)">
    <NIcon
      v-if="icon"
      :name="icon"
      weight="duotone"
      size="2.5rem"
      class="shrink-0 text-accent-600"
    />
    <div class="min-w-0">
      <p
        class="font-display text-3xl leading-none font-semibold text-base-900 tabular-nums sm:text-[2rem]"
      >
        <NTodo :content="value" :label="label">
          <!-- The invisible final value reserves the width and is what assistive tech reads;
               the aria-hidden overlay does the counting, so nothing shifts while it runs. -->
          <span ref="el" class="relative inline-block">
            <span class="opacity-0">{{ finalText }}</span>
            <span aria-hidden="true" class="absolute inset-0 text-left">{{ shownText }}</span>
          </span>
          <template #placeholder>—</template>
        </NTodo>
      </p>
      <p class="mt-1.5 text-sm text-base-550">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { isReal, type Content } from "~/shared/todo-content";
import type { IconName } from "~/utils/icons";

/**
 * Number + label with a one-time count-up. Count-up runs only on real numbers; a TODO_CONTENT
 * value renders the dev placeholder (nothing in production). Motion is skipped under
 * prefers-reduced-motion.
 */
const props = withDefaults(
  defineProps<{
    value: Content<number>;
    label: string;
    suffix?: string;
    icon?: IconName;
    class?: HTMLAttributes["class"];
  }>(),
  { suffix: "", icon: undefined },
);

const el = ref<HTMLElement | null>(null);
const inView = useInView(el);
const nf = new Intl.NumberFormat("en-NG");

const target = computed(() => (isReal(props.value) ? props.value : 0));
const finalText = computed(() => `${nf.format(target.value)}${props.suffix}`);
const current = ref<number | null>(null); // null → show the final value (SSR / reduced motion)
const shownText = computed(() =>
  current.value === null
    ? finalText.value
    : `${nf.format(Math.round(current.value))}${props.suffix}`,
);

const canAnimate = () =>
  import.meta.client && document.documentElement.classList.contains("motion-ok");

onMounted(() => {
  if (isReal(props.value) && canAnimate()) current.value = 0;
});

watch(inView, (visible) => {
  if (!visible || !isReal(props.value) || current.value === null) return;
  const to = props.value;
  const duration = 1200;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    current.value = to * (1 - Math.pow(1 - t, 3));
    if (t < 1) requestAnimationFrame(tick);
    else current.value = null;
  };
  requestAnimationFrame(tick);
});
</script>
