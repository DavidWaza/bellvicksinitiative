<template>
  <!-- AI cover: being drawn (skeleton only) or drawn (fades in over the skeleton once loaded) -->
  <div
    v-if="loading || book.coverUrl"
    :class="
      cn(
        'relative aspect-[3/4] w-full overflow-hidden rounded-r-xl rounded-l-sm shadow-[6px_10px_24px_-8px_rgb(29_26_21/0.35)]',
        !imageLoaded && 'bg-base-150',
      )
    "
    :aria-busy="!imageLoaded"
  >
    <div
      v-if="!imageLoaded"
      class="cover-skeleton absolute inset-0"
      role="img"
      :aria-label="`Illustrating the cover of ${book.title}`"
    >
      <!-- spine, picture area, title band: the shape of a cover -->
      <span class="absolute inset-y-0 left-0 w-2.5 bg-base-0/40" />
      <span
        class="absolute top-[18%] left-1/2 aspect-square w-[46%] -translate-x-1/2 rounded-full bg-base-0/45"
      />
      <span
        class="absolute top-[8%] left-1/2 h-[6%] w-[70%] -translate-x-1/2 rounded-full bg-base-0/50"
      />
      <span class="absolute inset-x-[10%] bottom-[8%] h-[16%] rounded-2xl bg-base-0/50" />
    </div>
    <img
      v-if="book.coverUrl"
      :src="book.coverUrl"
      :alt="`Cover of ${book.title}`"
      :class="
        cn(
          'absolute inset-0 size-full object-cover shadow-[inset_10px_0_0_0_rgb(0_0_0/0.12)] transition-opacity duration-500',
          imageLoaded ? 'opacity-100' : 'opacity-0',
        )
      "
      @load="imageLoaded = true"
    />
  </div>
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
      <template v-else-if="book.motif === 'sport'">
        <path d="M0 140 H200 V200 H0Z" class="fill-forest-500" />
        <path d="M0 150 H200 M100 140 V200" class="stroke-base-0/60" stroke-width="2" />
        <path
          d="M150 112 V140 M190 112 V140 M150 112 H190"
          class="stroke-base-0"
          stroke-width="3"
        />
        <circle cx="40" cy="150" r="11" class="fill-base-0" />
        <path d="M40 143 l6 4 -2 7 h-8 l-2 -7Z" class="fill-base-900" />
      </template>
      <template v-else-if="book.motif === 'art'">
        <circle cx="30" cy="34" r="18" class="fill-coral-500" />
        <circle cx="170" cy="30" r="14" class="fill-sun-500" />
        <circle cx="178" cy="150" r="20" class="fill-sky-500" />
        <circle cx="24" cy="160" r="13" class="fill-forest-500" />
        <path
          d="M60 182 Q100 160 140 182"
          class="stroke-lavender-600"
          stroke-width="6"
          stroke-linecap="round"
        />
      </template>
      <template v-else-if="book.motif === 'music'">
        <g class="fill-base-900/70">
          <circle cx="30" cy="54" r="7" />
          <rect x="35" y="22" width="3" height="32" />
          <circle cx="170" cy="40" r="7" />
          <rect x="175" y="10" width="3" height="30" />
          <circle cx="160" cy="140" r="6" />
          <rect x="164" y="114" width="3" height="26" />
        </g>
        <rect x="18" y="140" width="34" height="44" rx="10" class="fill-accent-700" />
        <ellipse cx="35" cy="140" rx="17" ry="6" class="fill-sun-150" />
      </template>
      <template v-else-if="book.motif === 'animals'">
        <path d="M0 150 Q100 135 200 150 V200 H0Z" class="fill-mint-150" />
        <g class="fill-forest-500/50">
          <circle cx="30" cy="40" r="7" />
          <circle cx="20" cy="28" r="3.5" />
          <circle cx="30" cy="24" r="3.5" />
          <circle cx="40" cy="28" r="3.5" />
          <circle cx="170" cy="60" r="7" />
          <circle cx="160" cy="48" r="3.5" />
          <circle cx="170" cy="44" r="3.5" />
          <circle cx="180" cy="48" r="3.5" />
        </g>
      </template>
      <template v-else-if="book.motif === 'confetti'">
        <rect
          v-for="(c, i) in CONFETTI"
          :key="i"
          :x="c[0]"
          :y="c[1]"
          width="10"
          height="5"
          rx="2"
          :transform="`rotate(${c[2]} ${c[0]} ${c[1]})`"
          :class="c[3]"
        />
      </template>
      <template v-else-if="book.motif === 'river'">
        <circle cx="160" cy="38" r="16" class="fill-sun-500" />
        <path d="M0 130 Q50 100 100 125 T200 115 V200 H0Z" class="fill-mint-150" />
        <path
          d="M70 200 Q90 160 120 150 T190 130"
          class="stroke-sky-500"
          stroke-width="10"
          stroke-linecap="round"
        />
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
const props = defineProps<{
  book: Pick<StoryBook, "title" | "tone" | "motif" | "coverUrl">;
  from: string;
  photoUrl: string | null;
  /** The AI cover is being drawn: show a skeleton instead of the drawn stand-in. */
  loading?: boolean;
}>();

/** The AI cover image has finished loading (until then the skeleton stays). */
const imageLoaded = ref(false);
watch(
  () => props.book.coverUrl,
  () => (imageLoaded.value = false),
);

const THEME = {
  sun: { bg: "bg-sun-100", bgFill: "fill-sun-100", ink: "text-sun-600" },
  sky: { bg: "bg-sky-150", bgFill: "fill-sky-150", ink: "text-sky-600" },
  coral: { bg: "bg-coral-100", bgFill: "fill-coral-100", ink: "text-coral-600" },
  mint: { bg: "bg-mint-100", bgFill: "fill-mint-100", ink: "text-forest-500" },
  lavender: { bg: "bg-lavender-100", bgFill: "fill-lavender-100", ink: "text-lavender-600" },
} as const;

const CONFETTI: [number, number, number, string][] = [
  [20, 30, 20, "fill-coral-500"],
  [60, 15, -30, "fill-sky-500"],
  [150, 25, 45, "fill-forest-500"],
  [180, 70, -15, "fill-lavender-600"],
  [15, 120, 60, "fill-sun-600"],
  [180, 150, 30, "fill-coral-500"],
  [40, 175, -40, "fill-sky-500"],
];

const STARS: [number, number, number][] = [
  [24, 30, 1],
  [70, 18, 0.7],
  [110, 46, 0.9],
  [20, 120, 0.6],
  [180, 110, 0.8],
  [40, 170, 0.7],
];
</script>

<style scoped>
/* A soft light sweeping across the skeleton. Still for visitors who prefer reduced motion. */
.cover-skeleton {
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgb(255 255 255 / 0.55) 50%,
    transparent 70%
  );
  background-size: 250% 100%;
  animation: cover-shimmer 1.6s ease-in-out infinite;
}
@keyframes cover-shimmer {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cover-skeleton {
    animation: none;
  }
}
</style>
