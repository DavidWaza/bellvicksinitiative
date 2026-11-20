<template>
  <div
    data-slot="blob-image"
    :class="cn('relative isolate overflow-hidden bg-accent-100', props.class)"
    :style="mask === 'none' ? undefined : maskStyle(mask)"
  >
    <NuxtPicture
      v-if="showPhoto"
      :src="resolved.src"
      :alt="resolved.alt"
      :sizes="sizes"
      :loading="preload ? undefined : 'lazy'"
      :preload="preload ? { fetchPriority: 'high' } : undefined"
      format="avif,webp"
      fit="cover"
      class="block size-full"
      :img-attrs="{
        class: 'size-full object-cover',
        fetchpriority: preload ? 'high' : undefined,
      }"
    />
    <div v-else aria-hidden="true" class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-accent-100 via-sun-100 to-coral-100" />
      <div class="absolute -top-1/4 -right-1/4 size-3/4 rounded-full bg-base-0/40" />
      <div class="absolute -bottom-1/4 -left-1/4 size-2/3 rounded-full bg-coral-100/70" />
      <div class="absolute inset-0 flex items-center justify-center text-accent-700/40">
        <NIcon name="photo" weight="duotone" size="22%" />
      </div>
      <span
        v-if="isDev"
        class="absolute top-[64%] left-1/2 -translate-x-1/2 rounded bg-accent-500 px-1.5 text-[10px] leading-4 font-bold tracking-wide whitespace-nowrap text-base-950 uppercase"
      >
        photo needed
      </span>
    </div>
    <span
      v-if="isDev && available && resolved.consent === 'pending'"
      class="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded bg-yellow-500 px-1.5 text-[10px] leading-4 font-bold tracking-wide whitespace-nowrap text-base-950 uppercase"
    >
      consent pending
    </span>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ImageConsent, ImageSlot } from "~/shared/image";
import { maskStyle, type MaskName } from "./mask-paths";

/**
 * A photo inside one of the reusable masks. Pass a whole `image` slot (from `shared/photos.ts`),
 * or `src` + `alt` + `consent` directly. With no source it shows a neutral warm placeholder.
 * In production a photo whose guardian consent is still `pending` is NOT rendered.
 */
const props = withDefaults(
  defineProps<{
    /** A resolved slot from `photo()`; takes precedence over src/alt/consent. */
    image?: ImageSlot;
    /** Absolute path under /images/…; leave undefined while the asset is outstanding. */
    src?: string;
    alt?: string;
    /** `none` keeps a plain rounded rectangle (e.g. campaign cards). */
    mask?: MaskName | "none";
    consent?: ImageConsent;
    /**
     * @nuxt/image syntax, NOT CSS media queries: "92vw md:45vw lg:560px"
     * (sm 600 · md 960 · lg 1280). CSS syntax silently produces 1px-wide images.
     */
    sizes?: string;
    /** The hero image: preloaded, eager, high priority. Everything else is lazy. */
    preload?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    mask: "blob-1",
    image: undefined,
    src: undefined,
    alt: "",
    consent: "pending",
    sizes: "xs:100vw sm:100vw md:100vw lg:100vw",
  },
);

const resolved = computed(() => ({
  src: props.image?.src ?? props.src,
  alt: props.image?.alt ?? props.alt,
  consent: props.image?.consent ?? props.consent,
}));

const isDev = import.meta.dev;
const available = computed(() => Boolean(resolved.value.src));
const showPhoto = computed(
  () => available.value && (isDev || resolved.value.consent !== "pending"),
);
</script>
