<template>
  <!-- Zero-size but NOT display:none — clipPath inside a display:none svg is ignored by some browsers. -->
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    class="pointer-events-none absolute size-0 overflow-hidden"
  >
    <defs>
      <clipPath
        v-for="name in MASK_NAMES"
        :id="`mask-${name}`"
        :key="name"
        clipPathUnits="objectBoundingBox"
      >
        <path :d="MASK_PATHS[name]" />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
import { MASK_NAMES, MASK_PATHS } from "../blob-image/mask-paths";
</script>
