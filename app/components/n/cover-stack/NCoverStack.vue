<template>
  <figure data-slot="cover-stack" :class="cn('relative mx-auto w-full max-w-md', props.class)">
    <div class="relative aspect-[1.15] w-full">
      <div
        v-for="(cover, i) in covers.slice(0, 2)"
        :key="cover.src"
        :class="
          cn(
            'cover absolute top-0 w-[58%] origin-bottom transition-transform duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:rotate-0',
            i === 0 ? 'left-0 z-10 -rotate-6' : 'right-0 top-[8%] rotate-[5deg]',
          )
        "
      >
        <picture>
          <source
            type="image/webp"
            :srcset="`${cover.src}-360.webp 360w, ${cover.src}-720.webp 720w`"
            sizes="(max-width: 600px) 52vw, 260px"
          />
          <img
            :src="`${cover.src}-720.jpg`"
            :alt="cover.alt"
            width="720"
            height="960"
            :loading="eager ? 'eager' : 'lazy'"
            :fetchpriority="eager && i === 0 ? 'high' : undefined"
            decoding="async"
            class="aspect-[3/4] w-full rounded-r-xl rounded-l-sm object-cover shadow-[inset_8px_0_0_0_rgb(0_0_0/0.18),10px_16px_30px_-10px_rgb(29_26_21/0.5)]"
          />
        </picture>
        <!-- Spine highlight -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 left-2 w-px bg-base-0/40"
        />
      </div>
    </div>
    <figcaption v-if="$slots.default" class="mt-6">
      <slot />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { SampleCover } from "~/shared/storybook-samples";

/** Two sample storybook covers, tilted and overlapping like books on a table. */
const props = defineProps<{
  covers: SampleCover[];
  /** Above the fold: load immediately, first cover at high priority. */
  eager?: boolean;
  class?: HTMLAttributes["class"];
}>();
</script>
