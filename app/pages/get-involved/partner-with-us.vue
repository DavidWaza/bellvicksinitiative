<template>
  <gi-apply :way="way" :image="image">
    <template #default="{ onSent }">
      <gi-apply-partner-form @sent="onSent" />
    </template>
  </gi-apply>
</template>

<script setup lang="ts">
import { findWay } from "~/features/site/involved";
import { photo } from "~/shared/photos";

const way = findWay("partner");
const image = photo("/images/involved/partner.jpg", "teacherAndStudents", "Partner with us");

usePageSeo({
  title: "Partner with us — Bellvicks Initiative",
  description:
    "Organisations and businesses: partner with Bellvicks to reach more communities across Nigeria.",
});
</script>
