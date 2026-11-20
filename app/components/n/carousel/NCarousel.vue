<template>
  <div
    data-slot="carousel"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    :class="cn('relative', props.class)"
    @keydown.left.prevent="scrollPrev"
    @keydown.right.prevent="scrollNext"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import emblaCarouselVue from "embla-carousel-vue";
import { carouselKey } from "./carousel-context";

/**
 * Embla carousel root: keyboard (←/→), swipe, no autoplay. Compose with NCarouselContent,
 * NCarouselItem and NCarouselControls. Arrow keys work while focus is anywhere inside.
 */
const props = defineProps<{
  /** Accessible name for the region, e.g. "Testimonials". */
  label: string;
  class?: HTMLAttributes["class"];
}>();

const [emblaRef, emblaApi] = emblaCarouselVue({ align: "start", containScroll: "trimSnaps" });

const selectedIndex = ref(0);
const slideCount = ref(0);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);

function sync() {
  const api = emblaApi.value;
  if (!api) return;
  selectedIndex.value = api.selectedScrollSnap();
  slideCount.value = api.scrollSnapList().length;
  canScrollPrev.value = api.canScrollPrev();
  canScrollNext.value = api.canScrollNext();
}

watch(emblaApi, (api) => {
  if (!api) return;
  sync();
  api.on("select", sync).on("reInit", sync);
});

const scrollPrev = () => emblaApi.value?.scrollPrev();
const scrollNext = () => emblaApi.value?.scrollNext();

provide(carouselKey, {
  emblaRef,
  emblaApi,
  selectedIndex,
  slideCount,
  canScrollPrev,
  canScrollNext,
  scrollPrev,
  scrollNext,
  scrollTo: (index) => emblaApi.value?.scrollTo(index),
});
</script>
