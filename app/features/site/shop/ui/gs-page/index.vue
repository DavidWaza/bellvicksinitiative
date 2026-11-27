<template>
  <div>
    <NPageHero :eyebrow="SHOP_NAME" :breadcrumbs="[{ label: 'Shop' }]">
      Shop with <NHeadingHighlight>purpose</NHeadingHighlight>
      <template #lead>
        <strong class="text-base-900"
          >Every item in our shop was donated by a generous person or organisation.</strong
        >
        When you buy one, the proceeds go to humanitarian work for children and communities across
        Nigeria.
      </template>
      <template #actions>
        <NButton to="#products" size="lg">
          <NIcon name="shop" weight="duotone" /> Shop the collection
        </NButton>
        <gs-bag-link />
      </template>
      <template #media>
        <!-- A little shop window: three products, gently tilted -->
        <div class="relative mx-auto grid max-w-md grid-cols-2 gap-4 sm:gap-5" aria-hidden="true">
          <gs-product-photo
            v-for="(p, i) in WINDOW"
            :key="p.slug"
            :product="p"
            :show-badge="false"
            :show-donated="false"
            :preload="i === 0"
            :sizes="i === 0 ? 'xs:70vw sm:60vw lg:340px' : 'xs:44vw sm:40vw lg:220px'"
            :class="
              cn(
                'shadow-soft',
                i === 0 && 'col-span-2 mx-auto w-3/4 -rotate-2',
                i === 1 && 'rotate-3',
                i === 2 && '-rotate-1 sm:translate-y-4',
              )
            "
          />
          <NSticker class="absolute top-4 -right-2 text-xl">Every item donated ✨</NSticker>
        </div>
      </template>
    </NPageHero>

    <!-- The shop's promise, said boldly: donated goods, humanitarian proceeds -->
    <NSection tone="forest" spacing="none" labelledby="promise-title" class="py-12 md:py-16">
      <NContainer>
        <div class="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p class="font-hand text-2xl text-sun-100">Our promise</p>
            <h2
              id="promise-title"
              class="font-display mt-2 text-3xl leading-tight font-semibold text-base-0 md:text-5xl"
            >
              Every item is <span class="text-accent-500">donated</span>.<br />
              Every sale funds <span class="text-accent-500">humanitarian work</span>.
            </h2>
            <p class="mt-4 max-w-2xl text-lg text-mint-100">
              Generous people and organisations give these goods to us. We sell them, and the
              proceeds go to humanitarian work: books, food, clean water and school support.
            </p>
          </div>
          <div class="flex flex-col items-start gap-3 lg:items-end">
            <NButton :to="ROUTES.shopDonateItem" color="light" size="lg">
              <NIcon name="gift" weight="duotone" /> Donate an item
            </NButton>
            <p class="text-sm text-mint-100">Items must be in resellable condition.</p>
          </div>
        </div>

        <!-- How it works: part of the promise -->
        <h3 class="sr-only">How the shop works</h3>
        <ol role="list" class="mt-10 grid gap-4 md:grid-cols-3">
          <li
            v-for="(step, i) in STEPS"
            :key="step.title"
            class="relative flex items-start gap-4 rounded-3xl bg-base-0/[0.07] p-5 ring-1 ring-base-0/10"
          >
            <NIconBlob :icon="step.icon" :tone="step.tone" class="size-14 shrink-0" />
            <div>
              <p class="text-xs font-bold tracking-widest text-accent-500 uppercase">
                Step {{ i + 1 }}
              </p>
              <h4 class="font-display mt-1 text-lg font-semibold text-base-0">{{ step.title }}</h4>
              <p class="mt-1 text-sm text-mint-100">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </NContainer>
    </NSection>

    <!-- The catalogue -->
    <NSection id="products" tone="cream" labelledby="products-title" class="scroll-mt-24">
      <NContainer>
        <gs-shop-switch current="self" class="mb-12" />
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <NEyebrow>The collection</NEyebrow>
            <h2
              id="products-title"
              class="font-display mt-3 text-3xl font-semibold text-forest-900 md:text-4xl"
            >
              Goods that do good
            </h2>
          </div>
          <label class="flex items-center gap-2 text-sm font-bold text-base-900">
            <NIcon name="sliders" class="text-forest-500" />
            Sort
            <NSelect v-model="sort" :options="SHOP_SORTS" class="w-52 font-normal" />
          </label>
        </div>

        <!-- Category filter: plain buttons, aria-pressed -->
        <div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            v-for="c in FILTERS"
            :key="c.value"
            type="button"
            :aria-pressed="category === c.value"
            :class="
              cn(
                'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors',
                category === c.value
                  ? 'border-forest-500 bg-forest-500 text-base-0'
                  : 'border-base-150 bg-base-0 text-base-900 hover:border-forest-500',
              )
            "
            @click="category = c.value"
          >
            <NIcon v-if="c.icon" :name="c.icon" weight="duotone" />
            {{ c.label }}
            <span class="text-xs opacity-70">{{ countIn(c.value) }}</span>
          </button>
        </div>

        <p class="sr-only" role="status">{{ shown.length }} products shown</p>
        <ul
          role="list"
          class="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4"
        >
          <li v-for="p in shown" :key="p.slug">
            <gs-product-card :product="p" />
          </li>
        </ul>
      </NContainer>
    </NSection>

    <!-- Gift band -->
    <NSection tone="forest" spacing="sm" labelledby="gift-band-title">
      <NContainer class="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <NIconBlob icon="gift" tone="sun" class="size-20 shrink-0" />
        <div class="flex-1">
          <h2 id="gift-band-title" class="font-display text-2xl font-semibold text-base-0">
            Looking for a gift that means more?
          </h2>
          <p class="mt-2 text-mint-100">
            Our gift box comes wrapped with a card for your message, a present that gives twice.
          </p>
        </div>
        <NButton :to="productPath('giving-gift-box')" color="primary" size="lg">
          See the gift box <NIcon name="arrowRight" />
        </NButton>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { productPath, ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import { PRODUCTS, productBySlug } from "../../domain/shop-products";
import {
  SHOP_CATEGORIES,
  SHOP_NAME,
  SHOP_SORTS,
  sortProducts,
  type Product,
  type ShopCategory,
  type ShopSort,
} from "../../domain/shop-types";

const FILTERS: { value: ShopCategory | "all"; label: string; icon?: IconName }[] = [
  { value: "all", label: "All" },
  ...SHOP_CATEGORIES,
];
const category = ref<ShopCategory | "all">("all");
const sort = ref<ShopSort>("featured");
const countIn = (c: ShopCategory | "all") =>
  c === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length;
const shown = computed(() =>
  sortProducts(
    category.value === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category.value),
    sort.value,
  ),
);

const WINDOW = ["giving-gift-box", "give-hope-tshirt", "morning-hope-mug"]
  .map(productBySlug)
  .filter((p): p is Product => Boolean(p));

const STEPS: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Someone gives",
    text: "A person or organisation donates goods to the shop.",
    icon: "volunteer",
    tone: "mint",
  },
  {
    title: "You shop",
    text: "Pick something you'll love, for you or as a gift.",
    icon: "shoppingBag",
    tone: "sun",
  },
  {
    title: "People are helped",
    text: "The proceeds go to humanitarian work for children and communities.",
    icon: "heart",
    tone: "coral",
  },
];
</script>
