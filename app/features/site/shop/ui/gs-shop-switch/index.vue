<template>
  <!-- The two ways to shop: for yourself, or for a child. A pair of links styled as tabs. -->
  <nav aria-label="Ways to shop" :class="cn('grid gap-3 sm:grid-cols-2', props.class)">
    <NuxtLink
      v-for="w in WAYS"
      :key="w.id"
      :to="w.to"
      :aria-current="current === w.id ? 'page' : undefined"
      :class="
        cn(
          'flex items-center gap-4 rounded-3xl border-2 p-4 transition-colors sm:p-5',
          current === w.id
            ? w.id === 'gift'
              ? 'border-coral-500 bg-coral-50'
              : 'border-forest-500 bg-mint-50'
            : 'border-base-150 bg-base-0 hover:border-base-500',
        )
      "
    >
      <NIconBlob :icon="w.icon" :tone="w.tone" class="size-14 shrink-0" />
      <span class="min-w-0">
        <span class="font-display block text-lg font-semibold text-forest-900">{{ w.title }}</span>
        <span class="block text-sm text-base-600">{{ w.text }}</span>
      </span>
      <NIcon
        v-if="current === w.id"
        name="check"
        weight="fill"
        size="1.5rem"
        :class="cn('ml-auto shrink-0', w.id === 'gift' ? 'text-coral-700' : 'text-forest-500')"
      />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

const props = defineProps<{ current: "self" | "gift"; class?: HTMLAttributes["class"] }>();

const WAYS: { id: "self" | "gift"; to: string; title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    id: "self",
    to: ROUTES.shop,
    title: "Shop for yourself",
    text: "Donated goods for you to keep. Proceeds fund humanitarian work.",
    icon: "shoppingBag",
    tone: "mint",
  },
  {
    id: "gift",
    to: ROUTES.shopGive,
    title: "Give to a child",
    text: "Pick and pay for school items. We give them to children.",
    icon: "heart",
    tone: "coral",
  },
];
</script>
