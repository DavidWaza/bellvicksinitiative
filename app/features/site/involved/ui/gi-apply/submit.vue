<template>
  <div class="grid gap-3">
    <NButton type="submit" size="lg" :disabled="pending" class="w-full">
      <NIcon v-if="pending" name="spinner" class="animate-spin" />
      {{ pending ? "Sending…" : label }}
    </NButton>
    <p class="text-center text-xs text-base-550">
      We only use your details to respond to you. See our
      <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2">privacy policy</NuxtLink>.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";

defineProps<{ pending: boolean; label: string }>();
</script>
