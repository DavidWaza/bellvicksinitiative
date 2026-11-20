import type { InjectionKey, Ref } from "vue";
import type emblaCarouselVue from "embla-carousel-vue";

/** Embla API type, derived from the Vue wrapper so we don't depend on `embla-carousel` directly. */
type EmblaCarouselType = NonNullable<ReturnType<typeof emblaCarouselVue>[1]["value"]>;

export interface CarouselContext {
  emblaRef: Ref<HTMLElement | undefined>;
  emblaApi: Ref<EmblaCarouselType | undefined>;
  selectedIndex: Ref<number>;
  slideCount: Ref<number>;
  canScrollPrev: Ref<boolean>;
  canScrollNext: Ref<boolean>;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
}

export const carouselKey: InjectionKey<CarouselContext> = Symbol("n-carousel");
