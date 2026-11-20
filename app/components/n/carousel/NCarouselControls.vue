<template>
  <div
    data-slot="carousel-controls"
    :class="cn('flex items-center justify-center gap-4', props.class)"
  >
    <button
      type="button"
      aria-label="Previous slide"
      :disabled="!ctx.canScrollPrev.value"
      :class="ARROW"
      @click="ctx.scrollPrev"
    >
      <NIcon name="caretLeft" />
    </button>
    <div class="flex items-center">
      <button
        v-for="i in ctx.slideCount.value"
        :key="i"
        type="button"
        :aria-label="`Go to slide ${i}`"
        :aria-current="ctx.selectedIndex.value === i - 1 ? 'true' : undefined"
        class="group flex size-11 items-center justify-center"
        @click="ctx.scrollTo(i - 1)"
      >
        <span
          :class="
            cn(
              'block h-2 rounded-full transition-all',
              ctx.selectedIndex.value === i - 1
                ? 'w-6 bg-forest-500'
                : 'w-2 bg-base-400 group-hover:bg-base-550',
            )
          "
        />
      </button>
    </div>
    <button
      type="button"
      aria-label="Next slide"
      :disabled="!ctx.canScrollNext.value"
      :class="ARROW"
      @click="ctx.scrollNext"
    >
      <NIcon name="caretRight" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { carouselKey } from "./carousel-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const ARROW =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-base-150 bg-base-0 text-forest-500 shadow-soft transition-colors hover:bg-forest-50 disabled:cursor-default disabled:opacity-40";

const ctx = inject(carouselKey);
if (!ctx) throw new Error("NCarouselControls must be used inside NCarousel");
</script>
