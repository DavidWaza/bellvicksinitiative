<template>
  <gi-apply :way="way" :image="image">
    <template #default="{ onSent }">
      <gi-apply-mentor-form @sent="onSent" />
    </template>
  </gi-apply>
</template>

<script setup lang="ts">
import { findWay } from "~/features/site/involved";
import { photo } from "~/shared/photos";

const way = findWay("mentor");
const image = photo("/images/involved/mentor.jpg", "mentorLaptop", "Become a mentor");

usePageSeo({
  title: "Become a mentor — Bellvicks Initiative",
  description:
    "Be the caring adult who encourages a child to learn and dream big. Apply to mentor with Bellvicks.",
});
</script>
