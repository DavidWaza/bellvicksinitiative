<template>
  <!-- How many children, then add to the bag as a gift. -->
  <div class="flex flex-wrap items-center gap-3">
    <div
      :class="
        cn(
          'inline-flex h-11 items-center rounded-full border',
          dark ? 'border-base-0/30 text-base-0' : 'border-base-150 bg-base-0 text-forest-900',
        )
      "
      role="group"
      :aria-label="`How many children to give ${gift.name} to`"
    >
      <button
        type="button"
        class="grid size-11 cursor-pointer place-items-center rounded-full disabled:opacity-40"
        aria-label="One fewer child"
        :disabled="count <= 1"
        @click="count--"
      >
        <NIcon name="minus" />
      </button>
      <span class="min-w-16 text-center text-sm font-bold" aria-live="polite"
        >{{ count }} {{ count === 1 ? "child" : "children" }}</span
      >
      <button
        type="button"
        class="grid size-11 cursor-pointer place-items-center rounded-full disabled:opacity-40"
        aria-label="One more child"
        :disabled="count >= MAX_LINE_QUANTITY"
        @click="count++"
      >
        <NIcon name="plus" />
      </button>
    </div>
    <NButton :color="dark ? 'primary' : 'coral'" size="sm" @click="give">
      <NIcon name="heart" weight="fill" /> Give · {{ formatMoney(gift.price * count) }}
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from "~/utils/format-money";
import type { GiftItem } from "../../domain/gift-items";
import { MAX_LINE_QUANTITY } from "../../domain/shop-types";

const props = defineProps<{ gift: GiftItem; dark?: boolean }>();
const count = ref(1);
const bag = useBag();

function give() {
  bag.addGift(props.gift, count.value);
  push.success({
    title: "Added to your bag as a gift",
    message: `${props.gift.name} for ${count.value === 1 ? "a child" : `${count.value} children`}`,
  });
  count.value = 1;
}
</script>
