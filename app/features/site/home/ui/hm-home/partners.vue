<template>
  <NSection
    tone="cream"
    spacing="none"
    aria-label="Our partners"
    class="pt-4 pb-16 md:pt-6 md:pb-20"
  >
    <NContainer>
      <div
        class="flex flex-col gap-4 border-y border-base-150 py-6 lg:flex-row lg:items-center lg:gap-10"
      >
        <p class="shrink-0 text-sm font-medium text-base-550">Trusted by our partners</p>
        <ul
          role="list"
          class="grid flex-1 grid-cols-2 items-center justify-items-center gap-x-6 gap-y-5 md:flex md:justify-between lg:gap-x-10"
        >
          <li v-for="partner in partners" :key="partner.name" class="shrink-0">
            <NPartnerLogo :name="partner.name" :logo="partner.logo" class="h-14 w-36 sm:w-44" />
          </li>
        </ul>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HomePartner } from "../../domain/home-types";

defineProps<{ partners: HomePartner[] }>();
</script>
