<template>
  <article class="group @container relative flex h-full flex-col">
    <gs-product-photo :product="product" />
    <div class="mt-3 flex flex-col gap-1 @[15rem]:mt-4 @[15rem]:flex-row @[15rem]:items-start @[15rem]:justify-between @[15rem]:gap-3">
      <div class="min-w-0">
        <h3 class="font-display text-base leading-snug font-semibold text-forest-900 @[15rem]:text-lg">
          <!-- The whole card is the link (stretched), the button sits above it. -->
          <NuxtLink :to="productPath(product.slug)" class="after:absolute after:inset-0">
            {{ product.name }}
          </NuxtLink>
        </h3>
        <p class="mt-1 line-clamp-2 hidden text-sm text-base-550 @[15rem]:block">{{ product.summary }}</p>
      </div>
      <p class="shrink-0 font-bold text-base-900 @[15rem]:pt-0.5">{{ formatMoney(product.price) }}</p>
    </div>
    <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 @[15rem]:gap-3">
      <!-- Colours available (chosen on the product page) -->
      <div
        v-if="product.colours.length > 1"
        class="flex gap-1.5"
        :aria-label="`${product.colours.length} colours: ${product.colours.map((c) => c.name).join(', ')}`"
        role="img"
      >
        <span
          v-for="c in product.colours"
          :key="c.name"
          class="size-5 rounded-full border-2 border-base-0 ring-1 ring-base-150"
          :style="{ backgroundColor: c.hex }"
        />
      </div>
      <span v-else />
      <NButton
        size="sm"
        variant="ghost"
        color="brand"
        class="relative z-10 w-full @[15rem]:w-auto"
        :aria-label="needsOptions ? `Choose options for ${product.name}` : `Add ${product.name} to bag`"
        @click="onAdd"
      >
        <NIcon name="shoppingBag" />
        {{ product.sizes?.length ? "Choose size" : needsOptions ? "Choose colour" : "Add to bag" }}
      </NButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { productPath } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import type { Product } from "../../domain/shop-types";

const props = defineProps<{ product: Product }>();
const colour = props.product.colours[0]?.name;
/** Sizes or several colours are chosen on the product page. */
const needsOptions = computed(
  () => Boolean(props.product.sizes?.length) || props.product.colours.length > 1,
);

const bag = useBag();
async function onAdd() {
  if (needsOptions.value) {
    await navigateTo(productPath(props.product.slug));
    return;
  }
  bag.add(props.product, { colour });
  push.success({ title: "Added to your bag", message: props.product.name });
}
</script>
