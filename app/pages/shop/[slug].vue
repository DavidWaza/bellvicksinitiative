<template>
  <gs-detail v-if="product" :key="product.slug" :product="product" />
</template>

<script setup lang="ts">
import { productBySlug } from "~/features/site/shop";

const route = useRoute();
const product = computed(() => productBySlug(String(route.params.slug)));
if (!product.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });

usePageSeo({
  title: `${product.value.name} — The Giving Shop`,
  description: `${product.value.summary} A donated item: the proceeds go to humanitarian work.`,
});
</script>
