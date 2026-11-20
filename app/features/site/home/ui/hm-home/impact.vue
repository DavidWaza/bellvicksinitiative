<template>
  <NSection tone="cream" spacing="none" aria-label="Our impact" class="pb-16 md:pb-24">
    <NContainer>
      <NCard v-reveal class="rounded-3xl">
        <ul
          role="list"
          class="grid grid-cols-2 lg:grid-cols-4 [&>li]:border-base-150 max-lg:[&>li:nth-child(even)]:border-l max-lg:[&>li:nth-child(n+3)]:border-t lg:[&>li:not(:first-child)]:border-l"
        >
          <li v-for="stat in stats" :key="stat.id" class="flex items-center px-5 py-6 sm:px-8">
            <NStat
              :value="stat.value"
              :label="stat.label"
              :suffix="stat.suffix"
              :icon="stat.icon"
            />
          </li>
        </ul>
      </NCard>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HomeImpactStat } from "../../domain/home-types";

defineProps<{ stats: HomeImpactStat[] }>();
</script>
