<template>
  <div v-if="content">
    <hm-home-hero :hero="content.hero" />
    <LazyHmHomePartners hydrate-on-visible :partners="content.partners" />
    <LazyHmHomeValues hydrate-on-visible :values="content.values" />
    <LazyHmHomeImpact hydrate-on-visible v-if="visible.impact" :stats="content.impact" />
    <LazyHmHomeAbout hydrate-on-visible :about="content.about" />
    <LazyHmHomeProgrammes hydrate-on-visible :programmes="content.programmes" />
    <LazyHmHomeBooksTeaser hydrate-on-visible :teaser="content.booksTeaser" />
    <LazyHmHomeCauses hydrate-on-visible :causes="content.causes" />
    <LazyHmHomeStory hydrate-on-visible v-if="visible.story" :story="content.story" />
    <LazyHmHomeGetInvolved hydrate-on-visible :image="content.involvedImage" />
    <LazyHmHomeNews hydrate-on-visible v-if="visible.news" :posts="content.news" />
    <LazyHmHomeTestimonials
      v-if="visible.testimonials"
      hydrate-on-visible
      :testimonials="content.testimonials"
    />
  </div>

  <NSection v-else-if="isLoading" aria-busy="true" class="min-h-[70vh]">
    <NContainer class="grid gap-10 lg:grid-cols-2">
      <div class="space-y-5">
        <div class="h-4 w-48 animate-pulse rounded-full bg-base-100" />
        <div class="h-40 animate-pulse rounded-3xl bg-base-100" />
        <div class="h-12 w-64 animate-pulse rounded-full bg-base-100" />
      </div>
      <div class="aspect-[0.956] max-w-md animate-pulse bg-base-100" :style="maskStyle('africa')" />
    </NContainer>
  </NSection>

  <NSection v-else class="text-center">
    <NContainer size="narrow">
      <NHeading as="h1" size="h2">We couldn't load this page</NHeading>
      <p class="mt-3 text-base-550">Please check your connection and try again.</p>
      <NButton class="mt-6" color="brand" @click="refetch()">Try again</NButton>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { maskStyle } from "~/components/n/blob-image/mask-paths";

const { content, visible, isLoading, refetch } = useHome();
</script>
