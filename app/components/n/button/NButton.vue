<template>
  <NLink
    v-if="to"
    data-slot="button"
    :to="to"
    :class="cn(buttonVariants({ color, variant, size }), props.class)"
  >
    <slot />
  </NLink>
  <button
    v-else
    data-slot="button"
    :type="type"
    :disabled="disabled"
    :class="cn(buttonVariants({ color, variant, size }), props.class)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import NLink from "../link/NLink.vue";
import { buttonVariants, type ButtonVariants } from "./button-variants";

const props = withDefaults(
  defineProps<{
    color?: ButtonVariants["color"];
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    /** Renders a link instead of a button. */
    to?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { color: "primary", variant: "solid", size: "default", type: "button" },
);
</script>
