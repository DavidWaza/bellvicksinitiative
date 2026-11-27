<template>
  <NSection tone="cream" spacing="none" labelledby="bag-title" class="min-h-[70vh] py-8 md:py-12">
    <NContainer>
      <div class="mx-auto max-w-5xl">
        <NBreadcrumbs :items="[{ label: 'Shop', to: ROUTES.shop }, { label: 'Your bag' }]" />
        <h1
          id="bag-title"
          class="font-display mt-6 text-3xl font-semibold text-forest-900 md:text-4xl"
        >
          Your bag
        </h1>

        <!-- Before the bag loads from this browser (keeps prerender and hydration in step) -->
        <p v-if="!ready" class="mt-8 text-base-550">Loading your bag…</p>

        <NEmptyState
          v-else-if="!items.length"
          icon="shoppingBag"
          tone="sun"
          title="Your bag is empty"
          class="mt-8"
        >
          Find something you love in {{ SHOP_NAME }}, or pick something to give to a child.
          <template #actions>
            <NButton :to="ROUTES.shop">
              <NIcon name="shop" weight="duotone" /> Shop for yourself
            </NButton>
            <NButton :to="ROUTES.shopGive" color="coral">
              <NIcon name="heart" weight="fill" /> Give to a child
            </NButton>
          </template>
        </NEmptyState>

        <div
          v-else
          class="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <div class="flex flex-col gap-8">
            <section v-if="forYou.length" aria-labelledby="bag-self">
              <h2 id="bag-self" class="flex items-center gap-2 text-sm font-bold tracking-widest text-base-600 uppercase">
                <NIcon name="shoppingBag" /> For you
              </h2>
              <ul role="list" class="mt-3 flex flex-col gap-4">
                <gs-bag-line v-for="item in forYou" :key="item.key" :item="item" />
              </ul>
            </section>
            <section v-if="gifts.length" aria-labelledby="bag-gift">
              <h2 id="bag-gift" class="flex items-center gap-2 text-sm font-bold tracking-widest text-coral-700 uppercase">
                <NIcon name="heart" weight="fill" /> Given to a child
              </h2>
              <p class="mt-1 text-sm text-base-600">
                You pay for these, and we give them to children who need them. They aren't sent to
                you.
              </p>
              <ul role="list" class="mt-3 flex flex-col gap-4">
                <gs-bag-line v-for="item in gifts" :key="item.key" :item="item" />
              </ul>
            </section>
          </div>

          <!-- Summary -->
          <aside
            aria-labelledby="summary-title"
            class="rounded-3xl bg-base-0 p-6 shadow-soft lg:sticky lg:top-28"
          >
            <h2 id="summary-title" class="font-display text-xl font-semibold text-forest-900">
              Order summary
            </h2>
            <dl class="mt-4 grid gap-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-base-600">Items ({{ count }})</dt>
                <dd class="font-bold">{{ formatMoney(subtotal) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-base-600">Delivery</dt>
                <dd class="text-base-600">{{ forYou.length ? "Calculated at checkout" : "None: given to children" }}</dd>
              </div>
              <div class="mt-2 flex justify-between border-t border-base-150 pt-3 text-base">
                <dt class="font-bold">Subtotal</dt>
                <dd class="font-bold">{{ formatMoney(subtotal) }}</dd>
              </div>
            </dl>
            <!-- No checkout yet: never fake a payment step. -->
            <NButton size="lg" class="mt-6 w-full" disabled>
              <NIcon name="privacy" /> Checkout coming soon
            </NButton>
            <p class="mt-3 text-center text-xs text-base-550">
              Secure online checkout is on its way. Your bag is saved in this browser.
            </p>
            <div class="mt-5 flex items-start gap-3 rounded-2xl bg-mint-100 p-4 text-sm">
              <NIcon name="heart" weight="fill" size="1.25rem" class="mt-0.5 text-coral-500" />
              <p>
                <strong>Every item was donated.</strong> The proceeds go to humanitarian work for
                children and communities across Nigeria.
              </p>
            </div>
            <NButton :to="ROUTES.shop" variant="ghost" color="brand" class="mt-4 w-full">
              Continue shopping
            </NButton>
          </aside>
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import { SHOP_NAME } from "../../domain/shop-types";

const { items, forYou, gifts, count, subtotal, ready } = useBag();
</script>
