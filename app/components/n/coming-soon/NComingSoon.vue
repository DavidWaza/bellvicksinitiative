<template>
  <NSection tone="cream" class="relative overflow-hidden">
    <NDotMap class="absolute inset-x-0 top-0 mx-auto w-full max-w-5xl" />
    <NContainer size="narrow" class="relative text-center">
      <div class="relative mx-auto mb-6 w-fit">
        <NDoodleSpark class="absolute -top-6 -right-10 w-12 text-sun-500" />
        <NIconBlob :icon="icon" tone="accent" shape="blob-1" class="size-24" />
      </div>
      <NEyebrow class="mb-4">{{ eyebrow }}</NEyebrow>
      <NHeading as="h1" size="display" class="text-forest-900">{{ title }}</NHeading>
      <p class="mx-auto mt-5 max-w-md text-lg text-base-550">
        {{ description ?? "We are still building this page. Thank you for your patience." }}
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NButton to="/" color="brand">Back to home</NButton>
        <slot />
      </div>
      <p class="font-hand mt-8 text-2xl text-base-550">Check back soon ♥</p>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { IconName } from "~/utils/icons";

withDefaults(
  defineProps<{ title: string; description?: string; icon?: IconName; eyebrow?: string }>(),
  { description: undefined, icon: "heart", eyebrow: "Coming soon" },
);
</script>
