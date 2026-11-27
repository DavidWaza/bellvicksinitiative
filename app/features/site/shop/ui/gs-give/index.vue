<template>
  <div>
    <NPageHero
      eyebrow="Give to a child"
      eyebrow-tone="coral"
      :breadcrumbs="[{ label: 'Shop', to: ROUTES.shop }, { label: 'Give to a child' }]"
    >
      Pick it. Pay for it. <NHeadingHighlight>A child gets it.</NHeadingHighlight>
      <template #lead>
        <strong class="text-base-900">This isn't shopping for yourself.</strong> Choose school
        items, pay for them, and we give them to children who need them. Nothing is sent to you,
        except our thanks.
      </template>
      <template #actions>
        <NButton to="#gifts" size="lg" color="coral">
          <NIcon name="heart" weight="fill" /> Choose a gift
        </NButton>
        <gs-bag-link />
      </template>
      <template #media>
        <NBlobImage :image="IMAGE" mask="blob-1" preload sizes="xs:92vw sm:80vw lg:520px" class="aspect-[1.1] w-full" />
        <NSticker class="absolute top-6 -left-2 text-xl">Buy it for a child ✨</NSticker>
      </template>
    </NPageHero>

    <!-- How it works -->
    <NSection tone="white" spacing="sm" aria-label="How Give to a child works">
      <NContainer>
        <ol role="list" class="grid gap-4 md:grid-cols-3">
          <li v-for="(s, i) in STEPS" :key="s.title" class="flex items-start gap-4 rounded-3xl bg-base-50 p-5">
            <NIconBlob :icon="s.icon" :tone="s.tone" class="size-14 shrink-0" />
            <div>
              <p class="text-xs font-bold tracking-widest text-coral-700 uppercase">Step {{ i + 1 }}</p>
              <h2 class="font-display mt-1 text-lg font-semibold text-forest-900">{{ s.title }}</h2>
              <p class="mt-1 text-sm text-base-600">{{ s.text }}</p>
            </div>
          </li>
        </ol>
      </NContainer>
    </NSection>

    <NSection id="gifts" tone="cream" labelledby="gifts-title" class="scroll-mt-24">
      <NContainer>
        <gs-shop-switch current="gift" />

        <div class="mt-12">
          <NEyebrow tone="coral">School items</NEyebrow>
          <h2 id="gifts-title" class="font-display mt-3 text-3xl font-semibold text-forest-900 md:text-4xl">
            What would you like to give?
          </h2>
          <p class="mt-2 max-w-2xl text-base-600">
            Prices are per child, from our Back to School list. Choose how many children to give to.
          </p>
        </div>

        <!-- The full kit, featured -->
        <article
          class="mt-8 grid items-center gap-6 rounded-3xl bg-forest-900 p-6 text-base-0 sm:p-8 md:grid-cols-[auto_1fr_auto]"
        >
          <NIconBlob :icon="FULL_KIT.icon" tone="sun" class="size-20" />
          <div>
            <p class="font-hand text-2xl text-sun-100">Best way to help</p>
            <h3 class="font-display text-2xl font-semibold">{{ FULL_KIT.name }}</h3>
            <p class="mt-1 text-mint-100">{{ FULL_KIT.blurb }}</p>
          </div>
          <div class="flex flex-col items-start gap-3 md:items-end">
            <p class="text-3xl font-bold">
              {{ formatMoney(FULL_KIT.price) }}<span class="text-base font-normal text-mint-100"> / child</span>
            </p>
            <gs-give-picker :gift="FULL_KIT" dark />
          </div>
        </article>

        <!-- Single items -->
        <ul role="list" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="g in GIFT_ITEMS" :key="g.slug">
            <article class="flex h-full flex-col rounded-3xl bg-base-0 p-5 shadow-soft">
              <div class="flex items-start gap-4">
                <div :class="cn('grid size-16 shrink-0 place-items-center rounded-2xl', TONE_CLASSES[g.tone].soft)">
                  <NIcon :name="g.icon" weight="duotone" size="2.25rem" :class="TONE_CLASSES[g.tone].ink" />
                </div>
                <div class="min-w-0">
                  <h3 class="font-display text-lg font-semibold text-forest-900">{{ g.name }}</h3>
                  <p v-if="g.quantity && g.quantity !== '1'" class="text-sm text-base-550">{{ g.quantity }}</p>
                  <p class="mt-1 font-bold text-base-900">
                    {{ formatMoney(g.price) }} <span class="text-sm font-normal text-base-550">/ child</span>
                  </p>
                </div>
              </div>
              <p class="mt-3 text-sm text-base-600">{{ g.blurb }}</p>
              <div class="mt-auto pt-4"><gs-give-picker :gift="g" /></div>
            </article>
          </li>
        </ul>

        <p class="mt-8 flex items-start gap-2 text-sm text-base-600">
          <NIcon name="info" class="mt-0.5 shrink-0 text-sky-700" />
          Want to support one child through school for a whole year or more?
          <NuxtLink :to="ROUTES.sponsorChild" class="font-bold text-forest-500 underline underline-offset-4">Sponsor a child</NuxtLink>
        </p>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { photo } from "~/shared/photos";
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import type { IconName } from "~/utils/icons";
import { TONE_CLASSES, type Tone } from "~/utils/tones";
import { FULL_KIT, GIFT_ITEMS } from "../../domain/gift-items";

const IMAGE = photo("/images/shop/give-hero.jpg", "childrenWithBooks", "Children with books");
const STEPS: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  { title: "Pick", text: "Choose a school item, or the full kit, and how many children to give to.", icon: "gift", tone: "sun" },
  { title: "Pay", text: "Pay for it at checkout, just like any other order.", icon: "shoppingBag", tone: "sky" },
  { title: "A child receives it", text: "We give the items to children who need them. Nothing is shipped to you.", icon: "heart", tone: "coral" },
];
</script>
