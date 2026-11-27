<template>
  <li
    class="grid grid-cols-[5.5rem_1fr] gap-4 rounded-3xl bg-base-0 p-4 shadow-soft sm:grid-cols-[7rem_1fr] sm:p-5"
  >
    <NuxtLink v-if="item.product" :to="productPath(item.slug)" tabindex="-1" aria-hidden="true">
      <gs-product-photo
        :product="item.product"
        :show-badge="false"
        :show-donated="false"
        sizes="xs:96px sm:120px"
        class="rounded-2xl"
      />
    </NuxtLink>
    <div
      v-else-if="item.gift"
      :class="cn('grid aspect-square place-items-center rounded-2xl', TONE_CLASSES[item.gift.tone].soft)"
      aria-hidden="true"
    >
      <NIcon :name="item.gift.icon" weight="duotone" size="55%" :class="TONE_CLASSES[item.gift.tone].ink" />
    </div>

    <div class="flex min-w-0 flex-col gap-1">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-display text-lg leading-snug font-semibold text-forest-900">
          <NuxtLink v-if="item.product" :to="productPath(item.slug)" class="hover:underline">{{
            item.name
          }}</NuxtLink>
          <template v-else>{{ item.name }}</template>
        </h3>
        <p class="shrink-0 font-bold text-base-900">{{ formatMoney(item.total) }}</p>
      </div>
      <p class="text-sm text-base-550">{{ detail }}</p>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <div
          class="inline-flex h-11 items-center rounded-full border border-base-150 bg-base-0"
          role="group"
          :aria-label="`Quantity of ${item.name}`"
        >
          <button
            type="button"
            class="grid size-11 cursor-pointer place-items-center rounded-full disabled:opacity-40"
            aria-label="One fewer"
            :disabled="item.quantity <= 1"
            @click="setQuantity(item.key, item.quantity - 1)"
          >
            <NIcon name="minus" />
          </button>
          <span class="w-7 text-center font-bold" aria-live="polite">{{ item.quantity }}</span>
          <button
            type="button"
            class="grid size-11 cursor-pointer place-items-center rounded-full disabled:opacity-40"
            aria-label="One more"
            :disabled="item.quantity >= MAX_LINE_QUANTITY"
            @click="setQuantity(item.key, item.quantity + 1)"
          >
            <NIcon name="plus" />
          </button>
        </div>
        <button
          type="button"
          class="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-bold text-coral-700 hover:underline"
          @click="remove(item.key)"
        >
          <NIcon name="trash" /> Remove
        </button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { productPath } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import { TONE_CLASSES } from "~/utils/tones";
import { MAX_LINE_QUANTITY, type BagItem } from "../../domain/shop-types";

/** One line of the bag: a product for yourself, or a gift for a child. */
const props = defineProps<{ item: BagItem }>();
const { setQuantity, remove } = useBag();

const detail = computed(() =>
  props.item.kind === "gift"
    ? `Donated to ${props.item.quantity === 1 ? "a child" : `${props.item.quantity} children`}`
    : [props.item.colour, props.item.size && `Size ${props.item.size}`].filter(Boolean).join(" · "),
);
</script>
