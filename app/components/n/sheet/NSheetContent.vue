<template>
  <DialogPortal>
    <DialogOverlay
      data-slot="sheet-overlay"
      class="sheet-overlay fixed inset-0 z-[60] bg-base-950/50"
    />
    <DialogContent
      data-slot="sheet-content"
      :class="
        cn(
          'sheet-content fixed inset-y-0 right-0 z-[70] flex h-dvh w-[min(92vw,420px)] flex-col overflow-y-auto bg-base-50 shadow-2xl',
          props.class,
        )
      "
    >
      <slot />
      <DialogClose
        aria-label="Close"
        class="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-base-100 text-base-900 transition-colors hover:bg-base-150"
      >
        <NIcon name="close" size="1.25rem" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from "reka-ui";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
