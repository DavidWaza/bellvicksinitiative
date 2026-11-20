<template>
  <div>
    <NPageHero eyebrow="Credits" :breadcrumbs="[{ label: 'Credits' }]">
      Photo credits
      <template #lead>
        Until our own photos are ready, some images on this site are free stock photos from
        Unsplash, used under the Unsplash licence. They are illustrative and don't show specific
        people we have supported. Thank you to these photographers.
      </template>
    </NPageHero>
    <NSection tone="white" aria-label="Photos">
      <NContainer>
        <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="item in photos" :key="item.key">
            <figure class="overflow-hidden rounded-2xl border border-base-150/70 bg-base-50">
              <NBlobImage
                :src="item.file"
                :alt="item.alt"
                consent="not-required"
                mask="none"
                sizes="xs:92vw sm:92vw md:380px"
                class="aspect-[4/3] w-full"
              />
              <figcaption class="p-4 text-sm text-base-600">
                Photo by <strong class="text-base-900">{{ item.credit.photographer }}</strong> on
                <NLink
                  :to="item.credit.url"
                  class="font-bold text-forest-500 underline underline-offset-4"
                >
                  {{ item.credit.site }}<span class="sr-only"> (opens in a new tab)</span>
                </NLink>
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 class="font-display mt-16 text-2xl font-semibold text-forest-900">Fonts and icons</h2>
        <ul role="list" class="mt-4 grid gap-2 text-base-600">
          <li>Fraunces, DM Sans and Caveat — SIL Open Font License.</li>
          <li>Icons by Phosphor Icons — MIT License.</li>
        </ul>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { STOCK_PHOTOS } from "~/shared/photos";

const photos = Object.entries(STOCK_PHOTOS).map(([key, value]) => ({ key, ...value }));
</script>
