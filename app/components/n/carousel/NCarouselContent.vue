<template>
  <div ref="viewport" data-slot="carousel-viewport" class="overflow-hidden">
    <div data-slot="carousel-content" :class="cn('flex touch-pan-y gap-4', props.class)">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { carouselKey } from "./carousel-context";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const ctx = inject(carouselKey);
if (!ctx) throw new Error("NCarouselContent must be used inside NCarousel");

// Embla's ref is a function-ref-compatible template ref; hand it our viewport element.
const viewport = ctx.emblaRef;
</script>
