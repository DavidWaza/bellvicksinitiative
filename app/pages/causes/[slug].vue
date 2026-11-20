<template>
  <cs-detail v-if="cause" :cause="cause" />
</template>

<script setup lang="ts">
const route = useRoute();
const { cause, suspense } = useCause(() => String(route.params.slug));
await suspense();
if (!cause.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });

usePageSeo({
  title: `${cause.value.title} — Bellvicks Initiative`,
  description: `${cause.value.summary} ${cause.value.description[0] ?? ""}`,
});
</script>
