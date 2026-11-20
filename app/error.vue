<template>
  <NuxtLayout>
    <n-coming-soon
      v-if="error?.statusCode === 404"
      eyebrow="Error 404"
      title="Page not found"
      description="The page you were looking for has moved or doesn't exist."
      icon="pin"
    />
    <n-coming-soon
      v-else
      eyebrow="Error"
      title="Something went wrong"
      description="Please try again in a moment."
      icon="warning"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();

useSeoMeta({ title: "Bellvicks Initiative", robots: "noindex" });
</script>
