<template>
  <img
    v-if="book.coverUrl"
    :src="book.coverUrl"
    :alt="`Cover of ${book.title}`"
    class="aspect-[3/4] w-full rounded-r-xl rounded-l-sm object-cover shadow-[inset_10px_0_0_0_rgb(0_0_0/0.12),6px_10px_24px_-8px_rgb(29_26_21/0.45)]"
  />
  <div
    v-else
    :class="
      cn(
        'relative aspect-square w-full overflow-hidden rounded-r-xl rounded-l-sm shadow-[inset_10px_0_0_0_rgb(0_0_0/0.12),6px_10px_24px_-8px_rgb(29_26_21/0.45)]',
        THEME[book.tone].bg,
      )
    "
  >
    <!-- Motif (decorative) -->
    <svg viewBox="0 0 200 200" aria-hidden="true" class="absolute inset-0 size-full" fill="none">
      <template v-if="book.motif === 'tree'">
        <circle cx="160" cy="38" r="18" class="fill-sun-500" />
        <path d="M0 150 Q100 130 200 150 V200 H0Z" class="fill-mint-150" />
        <rect x="34" y="78" width="16" height="72" rx="6" class="fill-accent-700" />
        <ellipse cx="42" cy="70" rx="38" ry="22" class="fill-forest-500" />
      </template>
      <template v-else-if="book.motif === 'market'">
        <path
          v-for="i in 8"
          :key="i"
          :d="`M${(i - 1) * 25} 0 h25 v34 q-12.5 10 -25 0Z`"
          :class="i % 2 ? 'fill-coral-500' : 'fill-base-0'"
        />
        <path d="M0 160 H200 V200 H0Z" class="fill-sun-150" />
        <circle cx="30" cy="150" r="10" class="fill-red-600" />
        <circle cx="48" cy="152" r="9" class="fill-sun-500" />
        <circle cx="172" cy="150" r="11" class="fill-forest-500" />
      </template>
      <template v-else>
        <circle cx="158" cy="40" r="20" class="fill-sun-150" />
        <circle cx="166" cy="34" r="17" :class="THEME[book.tone].bgFill" />
        <path
          v-for="(s, i) in STARS"
          :key="i"
          :transform="`translate(${s[0]} ${s[1]}) scale(${s[2]})`"
          d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z"
          class="fill-sun-500"
        />
      </template>
    </svg>

    <!-- The star of the book -->
    <div class="absolute top-[16%] left-1/2 w-[48%] -translate-x-1/2" :style="maskStyle('blob-1')">
      <img
        v-if="photoUrl"
        :src="photoUrl"
        alt=""
        class="aspect-square w-full bg-base-0 object-cover"
      />
      <div v-else class="flex aspect-square w-full items-end justify-center bg-base-0/70">
        <NIcon name="user" weight="duotone" size="85%" :class="THEME[book.tone].ink" />
      </div>
    </div>

    <!-- Title band -->
    <div class="absolute inset-x-[6%] bottom-[6%] rounded-2xl bg-base-0/92 px-3 py-2.5 text-center">
      <p
        class="font-display text-[clamp(0.95rem,4.2cqi,1.5rem)] leading-tight font-semibold text-forest-900"
      >
        {{ book.title }}
      </p>
      <p class="mt-0.5 text-xs font-bold text-base-600">By {{ from }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { maskStyle } from "~/components/n/blob-image/mask-paths";
import type { StoryBook } from "../../domain/storybook-types";

/** An illustrated stand-in cover until the real illustration service exists. Purely decorative. */
defineProps<{ book: StoryBook; from: string; photoUrl: string | null }>();

const THEME = {
  sun: { bg: "bg-sun-100", bgFill: "fill-sun-100", ink: "text-sun-600" },
  sky: { bg: "bg-sky-150", bgFill: "fill-sky-150", ink: "text-sky-600" },
  coral: { bg: "bg-coral-100", bgFill: "fill-coral-100", ink: "text-coral-600" },
  mint: { bg: "bg-mint-100", bgFill: "fill-mint-100", ink: "text-forest-500" },
  lavender: { bg: "bg-lavender-100", bgFill: "fill-lavender-100", ink: "text-lavender-600" },
} as const;

const STARS: [number, number, number][] = [
  [24, 30, 1],
  [70, 18, 0.7],
  [110, 46, 0.9],
  [20, 120, 0.6],
  [180, 110, 0.8],
  [40, 170, 0.7],
];
</script>
