<template>
  <div>
    <NSection tone="cream" spacing="none" labelledby="product-title" class="pt-8 pb-16 md:pb-24">
      <NContainer>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <NBreadcrumbs
            :items="[{ label: 'Shop', to: ROUTES.shop }, { label: product.name }]"
          />
          <gs-bag-link />
        </div>

        <div class="mt-8 grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <!-- Photo (a plain stock stand-in until the real product photo exists) -->
          <div class="lg:sticky lg:top-28">
            <gs-product-photo
              :product="product"
              sizes="xs:92vw sm:92vw md:92vw lg:560px"
              preload
              class="shadow-soft"
            />
          </div>

          <!-- Details and buying -->
          <div>
            <p class="flex items-center gap-2 text-sm font-bold text-base-550">
              <NIcon :name="categoryOf.icon" weight="duotone" class="text-forest-500" />
              {{ categoryOf.label }}
              <NBadge v-if="product.badge" tone="sun" class="ml-1">{{ product.badge }}</NBadge>
            </p>
            <h1
              id="product-title"
              class="font-display mt-3 text-4xl leading-tight font-semibold text-forest-900 md:text-5xl"
            >
              {{ product.name }}
            </h1>
            <p class="mt-4 text-2xl font-bold text-base-900">{{ formatMoney(product.price) }}</p>
            <p class="mt-4 text-lg text-base-600">{{ product.summary }}</p>

            <form class="mt-8 grid gap-6" @submit.prevent="onAdd">
              <!-- Colour -->
              <fieldset v-if="product.colours.length > 1">
                <legend class="mb-3 text-sm font-bold text-base-900">
                  Colour: <span class="font-normal text-base-600">{{ colour }}</span>
                </legend>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="c in product.colours"
                    :key="c.name"
                    class="cursor-pointer rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest-500"
                  >
                    <input
                      v-model="colour"
                      type="radio"
                      name="colour"
                      :value="c.name"
                      class="sr-only"
                    />
                    <span
                      :class="
                        cn(
                          'block size-10 rounded-full border-[3px] border-base-0 ring-1 transition-shadow',
                          colour === c.name ? 'ring-2 ring-forest-500' : 'ring-base-150',
                        )
                      "
                      :style="{ backgroundColor: c.hex }"
                    />
                    <span class="sr-only">{{ c.name }}</span>
                  </label>
                </div>
              </fieldset>

              <!-- Size -->
              <div v-if="product.sizes?.length">
                <NChoiceGroup
                  v-model="size"
                  legend="Size"
                  name="size"
                  :options="product.sizes.map((s) => ({ value: s, label: s }))"
                  :error="sizeError"
                />
              </div>

              <!-- Quantity + add -->
              <div class="flex flex-wrap items-end gap-4">
                <div>
                  <p id="qty-label" class="mb-1.5 text-sm font-bold text-base-900">Quantity</p>
                  <div
                    class="inline-flex h-14 items-center rounded-full border border-base-500 bg-base-0"
                    role="group"
                    aria-labelledby="qty-label"
                  >
                    <button
                      type="button"
                      class="grid size-12 cursor-pointer place-items-center rounded-full text-forest-900 disabled:opacity-40"
                      aria-label="One fewer"
                      :disabled="quantity <= 1"
                      @click="quantity--"
                    >
                      <NIcon name="minus" />
                    </button>
                    <span class="w-8 text-center font-bold" aria-live="polite">{{ quantity }}</span>
                    <button
                      type="button"
                      class="grid size-12 cursor-pointer place-items-center rounded-full text-forest-900 disabled:opacity-40"
                      aria-label="One more"
                      :disabled="quantity >= MAX_LINE_QUANTITY"
                      @click="quantity++"
                    >
                      <NIcon name="plus" />
                    </button>
                  </div>
                </div>
                <NButton type="submit" size="lg" class="min-w-56 flex-1">
                  <NIcon name="shoppingBag" /> Add to bag ·
                  {{ formatMoney(product.price * quantity) }}
                </NButton>
              </div>
            </form>

            <!-- Gives back -->
            <div class="mt-6 flex items-start gap-3 rounded-2xl bg-mint-100 p-4 text-sm text-base-900">
              <NIcon name="heart" weight="fill" size="1.25rem" class="mt-0.5 text-coral-500" />
              <p>
                <strong>A donated item.</strong> It was given to the shop by a generous person or
                organisation, and the proceeds from your purchase go to humanitarian work for
                children and communities across Nigeria.
              </p>
            </div>

            <div class="mt-8 border-t border-base-150 pt-6">
              <h2 class="font-display text-xl font-semibold text-forest-900">About this item</h2>
              <p v-for="(para, i) in product.description" :key="i" class="mt-3 text-base-600">
                {{ para }}
              </p>
              <ul role="list" class="mt-4 grid gap-2 sm:grid-cols-2">
                <li v-for="d in product.details" :key="d" class="flex items-center gap-2 text-sm">
                  <NIcon name="check" weight="fill" class="text-forest-500" /> {{ d }}
                </li>
              </ul>
            </div>

            <!-- Delivery and returns: policies not supplied yet -->
            <div v-if="POLICIES.length" class="mt-6 divide-y divide-base-150 border-y border-base-150">
              <details v-for="p in POLICIES" :key="p.title" class="group">
                <summary
                  class="flex min-h-14 cursor-pointer list-none items-center gap-3 font-bold text-base-900 [&::-webkit-details-marker]:hidden"
                >
                  <NIcon :name="p.icon" weight="duotone" class="text-forest-500" size="1.4rem" />
                  {{ p.title }}
                  <NIcon
                    name="caretDown"
                    class="ml-auto transition-transform group-open:rotate-180"
                  />
                </summary>
                <div class="pb-4 text-sm text-base-600">
                  <NTodo :content="p.content" :label="p.title">{{ p.content }}</NTodo>
                </div>
              </details>
            </div>
          </div>
        </div>
      </NContainer>
    </NSection>

    <!-- More to love -->
    <NSection tone="white" labelledby="related-title">
      <NContainer>
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 id="related-title" class="font-display text-3xl font-semibold text-forest-900">
            You might also like
          </h2>
          <NButton :to="ROUTES.shop" variant="ghost" color="brand">
            See everything <NIcon name="arrowRight" />
          </NButton>
        </div>
        <ul role="list" class="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          <li v-for="p in related" :key="p.slug"><gs-product-card :product="p" /></li>
        </ul>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import { isReal } from "~/shared/todo-content";
import { formatMoney } from "~/utils/format-money";
import type { IconName } from "~/utils/icons";
import { PRODUCTS, SHOP_POLICIES } from "../../domain/shop-products";
import { MAX_LINE_QUANTITY, SHOP_CATEGORIES, type Product } from "../../domain/shop-types";

const props = defineProps<{ product: Product }>();
const bag = useBag();
const route = useRoute();

const categoryOf = computed(
  () => SHOP_CATEGORIES.find((c) => c.value === props.product.category) ?? SHOP_CATEGORIES[0]!,
);
const colour = ref(props.product.colours[0]?.name);
const size = ref<string>();
const sizeError = ref("");
const quantity = ref(1);
watch(size, () => (sizeError.value = ""));

// The page is prerendered without a query string: apply ?colour= (from a product card) after mount.
onMounted(() => {
  const wanted = String(route.query.colour ?? "");
  if (props.product.colours.some((c) => c.name === wanted)) colour.value = wanted;
});

function onAdd() {
  if (props.product.sizes?.length && !size.value) {
    sizeError.value = "Please choose a size.";
    return;
  }
  bag.add(props.product, { colour: colour.value, size: size.value, quantity: quantity.value });
  push.success({
    title: "Added to your bag",
    message: [`${quantity.value}× ${props.product.name}`, colour.value, size.value]
      .filter(Boolean)
      .join(" · "),
  });
  quantity.value = 1;
}

/**
 * Delivery and returns: until Bellvicks supplies the policies, dev shows "content needed" and
 * production leaves the rows out (an accordion that opens to nothing helps no one).
 */
const POLICIES = (
  [
    { title: "Delivery", icon: "truck", content: SHOP_POLICIES.delivery },
    { title: "Returns", icon: "returns", content: SHOP_POLICIES.returns },
  ] satisfies { title: string; icon: IconName; content: unknown }[]
).filter((p) => import.meta.dev || isReal(p.content));

/** Same category first, then the rest; never the product itself. */
const related = computed(() =>
  [
    ...PRODUCTS.filter((p) => p.category === props.product.category),
    ...PRODUCTS.filter((p) => p.category !== props.product.category),
  ]
    .filter((p) => p.slug !== props.product.slug)
    .slice(0, 4),
);
</script>
