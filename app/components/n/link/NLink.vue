<template>
  <a
    v-if="isExternal"
    :href="to"
    :target="newTab ? '_blank' : undefined"
    :rel="rel"
    :class="props.class"
  >
    <slot />
  </a>
  <NuxtLink v-else :to="to" :class="props.class">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  to: string;
  class?: HTMLAttributes["class"];
}>();

/** Internal paths go through NuxtLink; http(s), mailto and tel render a plain anchor. */
const isExternal = computed(() => /^(https?:|mailto:|tel:)/i.test(props.to));
const newTab = computed(() => /^https?:/i.test(props.to));
const rel = computed(() => (newTab.value ? "noopener noreferrer" : undefined));
</script>
