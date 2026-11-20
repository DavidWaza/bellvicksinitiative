<template>
  <div>
    <NPageHero eyebrow="Legal" :breadcrumbs="[{ label: title }]">
      {{ title }}
      <template #lead>
        Last updated
        <time :datetime="toIsoDate(LEGAL_LAST_UPDATED)">{{
          formatDisplayDate(LEGAL_LAST_UPDATED)
        }}</time>
      </template>
    </NPageHero>
    <NSection tone="white" :aria-label="title">
      <NContainer size="narrow">
        <div
          v-if="LEGAL_IS_DRAFT"
          role="note"
          class="mb-10 flex items-start gap-3 rounded-2xl border border-yellow-150 bg-yellow-50 p-4 text-sm text-base-900"
        >
          <NIcon name="info" size="1.4rem" class="shrink-0 text-yellow-600" />
          <p>
            <strong>Draft.</strong> This page is a plain-language draft and is being reviewed. If
            you have questions, email
            <NLink :to="`mailto:${SITE_INFO.email}`" class="font-bold underline">{{
              SITE_INFO.email
            }}</NLink
            >.
          </p>
        </div>
        <NProse><slot /></NProse>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { formatDisplayDate, toIsoDate } from "~/utils/date-formatters";
import { LEGAL_IS_DRAFT, LEGAL_LAST_UPDATED } from "../../domain/legal-meta";

defineProps<{ title: string }>();
</script>
