<template>
  <pr-detail v-if="area" :area="area" />
</template>

<script setup lang="ts">
import { findFocusArea } from "~/features/site/programmes";

const route = useRoute();
const area = findFocusArea(String(route.params.slug));
if (!area) throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });

usePageSeo({
  title: `${area.title} — Bellvicks Initiative`,
  description: `${area.tagline} ${area.intro}`,
});
</script>
