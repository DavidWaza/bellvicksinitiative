<template>
  <div :class="cn('relative isolate aspect-square overflow-hidden rounded-3xl bg-base-100', props.class)">
    <NBlobImage
      :image="product.image"
      mask="none"
      :sizes="sizes"
      :preload="preload"
      class="size-full transition-transform duration-500 group-hover:scale-[1.04]"
    />
    <!-- Every item in the shop was donated: said on every product photo -->
    <span
      v-if="showDonated"
      class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-base-0/95 px-3 py-1 text-xs font-bold text-forest-900 shadow-soft"
    >
      <NIcon name="heart" weight="fill" class="text-coral-500" /> Donated
    </span>
    <NSticker v-if="product.badge && showBadge" class="absolute top-3 left-3 text-base">{{
      product.badge
    }}</NSticker>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { Product } from "../../domain/shop-types";

/**
 * A product's photo, square and rounded. Stock stand-ins until real product photos exist
 * (shared/photos.ts). The alt text describes what the photo actually shows.
 */
const props = withDefaults(
  defineProps<{
    product: Product;
    showBadge?: boolean;
    /** The "Donated" tag (off for small thumbnails). */
    showDonated?: boolean;
    /** @nuxt/image syntax (see NBlobImage), not CSS. Default: a grid card. */
    sizes?: string;
    preload?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { showBadge: true, showDonated: true, sizes: "xs:46vw sm:46vw md:30vw lg:300px", preload: false },
);
</script>
