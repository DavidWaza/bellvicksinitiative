<template>
  <NuxtLink
    :to="ROUTES.shopBag"
    :class="
      cn(
        'inline-flex h-11 items-center gap-2 rounded-full border border-base-150 bg-base-0 pr-2 pl-4 text-sm font-bold text-forest-900 shadow-soft transition-colors hover:border-forest-500',
        props.class,
      )
    "
    :aria-label="ready && count ? `Your bag, ${count} item${count === 1 ? '' : 's'}` : 'Your bag'"
  >
    <NIcon name="shoppingBag" size="1.2rem" />
    Bag
    <span
      :class="
        cn(
          'grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-xs transition-colors',
          ready && count ? 'bg-accent-500 text-base-950' : 'bg-base-100 text-base-600',
        )
      "
      >{{ ready ? count : 0 }}</span
    >
  </NuxtLink>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ROUTES } from "~/shared/site-routes";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const { count, ready } = useBag();
</script>
