<template>
  <nav aria-label="Breadcrumb" :class="props.class">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-base-550">
      <li class="flex items-center">
        <NuxtLink
          to="/"
          class="inline-flex min-h-11 items-center hover:text-forest-500 hover:underline"
        >
          Home
        </NuxtLink>
      </li>
      <li v-for="(item, i) in items" :key="item.label" class="flex items-center gap-1.5">
        <NIcon name="caretRight" size="0.85em" class="text-base-400" />
        <NuxtLink
          v-if="item.to && i < items.length - 1"
          :to="item.to"
          class="inline-flex min-h-11 items-center hover:text-forest-500 hover:underline"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          aria-current="page"
          class="inline-flex min-h-11 items-center font-medium text-base-900"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

/** "Home" is implied. The last item is the current page. */
const props = defineProps<{ items: BreadcrumbItem[]; class?: HTMLAttributes["class"] }>();
</script>
