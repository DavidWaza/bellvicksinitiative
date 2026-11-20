<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-4 opacity-0"
  >
    <NButton
      v-if="visible"
      :to="ROUTES.donate"
      size="lg"
      class="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
    >
      <NIcon name="heart" weight="fill" />
      Donate
    </NButton>
  </Transition>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";

const { visible } = useFloatingDonate();
</script>
