<template>
  <gi-apply :way="way" :image="image">
    <template #default="{ onSent }">
      <gi-apply-volunteer-form @sent="onSent" />
    </template>
  </gi-apply>
</template>

<script setup lang="ts">
import { findWay } from "~/features/site/involved";
import { photo } from "~/shared/photos";

const way = findWay("volunteer");
const image = photo("/images/involved/volunteer.jpg", "volunteers", "Volunteer");

usePageSeo({
  title: "Volunteer — Bellvicks Initiative",
  description:
    "Join the Bellvicks volunteer network and give your time and skills to support children and communities.",
});
</script>
