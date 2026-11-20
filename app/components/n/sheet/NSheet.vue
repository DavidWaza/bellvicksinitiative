<template>
  <DialogRoot v-model:open="open">
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot } from "reka-ui";

/** Reka Dialog as a side sheet. Compose with NSheetContent, NSheetTitle, NSheetDescription. */
const open = defineModel<boolean>("open", { default: false });
</script>
