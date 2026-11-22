<template>
  <NSection tone="cream" spacing="none" labelledby="cart-title" class="min-h-[70vh] py-8 md:py-12">
    <NContainer>
      <div class="mx-auto max-w-5xl">
        <h1 id="cart-title" class="font-display text-3xl font-semibold text-forest-900 md:text-4xl">
          Your cart
        </h1>

        <!-- Before the cart loads from this browser (keeps prerender and hydration in step) -->
        <p v-if="!ready" class="mt-8 text-base-550">Loading your cart…</p>

        <NEmptyState
          v-else-if="!items.length"
          icon="books"
          tone="coral"
          title="Your cart is empty"
          class="mt-8"
        >
          Create a storybook starring your child and add the stories you love.
          <template #actions>
            <NButton :to="ROUTES.storybookCreate" color="coral">
              <NIcon name="book" weight="duotone" /> Create a storybook
            </NButton>
          </template>
        </NEmptyState>

        <div
          v-else
          class="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <ul role="list" class="flex flex-col gap-4">
            <li
              v-for="item in items"
              :key="item.key"
              class="grid grid-cols-[6rem_1fr] gap-4 rounded-3xl bg-base-0 p-4 shadow-soft sm:grid-cols-[8rem_1fr] sm:p-5"
            >
              <div class="@container">
                <sb-wizard-book-cover :book="item" :from="item.child.from" :photo-url="null" />
              </div>
              <div class="flex min-w-0 flex-col gap-2">
                <h2 class="font-display text-lg font-semibold text-forest-900 sm:text-xl">
                  {{ item.title }}
                </h2>
                <p class="text-sm text-base-550">
                  For {{ item.child.name }}, age {{ item.child.age }} · from {{ item.child.from }}
                </p>
                <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div class="flex items-center gap-2">
                    <label :for="`qty-${item.key}`" class="text-sm font-bold text-base-600"
                      >Qty</label
                    >
                    <select
                      :id="`qty-${item.key}`"
                      :value="item.quantity"
                      class="h-11 rounded-xl border border-base-500 bg-base-0 px-3 text-base-900"
                      @change="
                        setQuantity(item.key, Number(($event.target as HTMLSelectElement).value))
                      "
                    >
                      <option v-for="n in MAX_QUANTITY" :key="n" :value="n">{{ n }}</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-3">
                    <span v-if="priced" class="font-bold text-base-900">{{
                      formatMoney(pricing.bookPrice * item.quantity)
                    }}</span>
                    <button
                      type="button"
                      :aria-label="`Remove ${item.title} for ${item.child.name}`"
                      class="flex size-11 cursor-pointer items-center justify-center rounded-full text-base-600 hover:bg-base-100"
                      @click="remove(item.key)"
                    >
                      <NIcon name="trash" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Summary -->
          <aside
            aria-labelledby="summary-title"
            class="rounded-3xl bg-base-0 p-6 shadow-soft lg:sticky lg:top-24"
          >
            <h2 id="summary-title" class="font-display text-xl font-semibold text-forest-900">
              Order summary
            </h2>
            <dl class="mt-4 flex flex-col gap-2 text-base-600">
              <div class="flex justify-between gap-4">
                <dt>{{ count }} {{ count === 1 ? "book" : "books" }}</dt>
                <dd class="font-bold text-base-900">
                  {{ priced ? formatMoney(pricing.bookPrice * count) : "Price coming soon" }}
                </dd>
              </div>
              <div class="flex justify-between gap-4 text-sm">
                <dt>Delivery</dt>
                <dd>Calculated at checkout</dd>
              </div>
            </dl>
            <NButton
              :to="priced ? ROUTES.checkout : undefined"
              :disabled="!priced"
              size="lg"
              color="coral"
              class="mt-6 w-full"
            >
              Checkout
            </NButton>
            <p v-if="!priced" class="mt-3 text-sm text-base-550">
              Online ordering opens soon. To order now,
              <NuxtLink :to="ROUTES.contact" class="underline underline-offset-2"
                >contact us</NuxtLink
              >.
            </p>
            <NButton :to="ROUTES.storybookCreate" variant="ghost" color="brand" class="mt-3 w-full"
              >Create another storybook</NButton
            >
          </aside>
        </div>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import { MAX_QUANTITY } from "../../domain/cart-types";

const { items, ready, pricing, count, remove, setQuantity } = useCart();
const priced = computed(() => pricing.bookPrice > 0);
</script>
