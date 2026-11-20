<template>
  <NSection
    tone="cream"
    spacing="none"
    aria-label="Our values"
    class="relative z-10 -mt-12 pb-16 md:pb-20"
  >
    <NContainer>
      <h2 class="sr-only">Our values</h2>
      <ul role="list" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(value, i) in values" :key="value.id" v-reveal="i" class="flex">
          <NCard class="w-full flex-row items-start gap-4 p-5 sm:flex-col sm:p-6">
            <NIconBlob
              :icon="value.icon"
              :tone="value.tone"
              :shape="SHAPES[i % SHAPES.length]"
              class="size-14 sm:size-16"
            />
            <div>
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ value.title }}</h3>
              <p class="mt-2 text-[0.9375rem] text-base-550">{{ value.description }}</p>
            </div>
          </NCard>
        </li>
      </ul>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HomeValue } from "../../domain/home-types";

defineProps<{ values: HomeValue[] }>();

const SHAPES = ["blob-3", "blob-1", "blob-4", "blob-2"] as const;
</script>
