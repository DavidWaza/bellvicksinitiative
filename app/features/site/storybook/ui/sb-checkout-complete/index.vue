<template>
  <NSection
    tone="cream"
    spacing="none"
    labelledby="complete-title"
    class="min-h-[70vh] py-12 md:py-16"
  >
    <NContainer>
      <div class="mx-auto flex max-w-lg flex-col items-center text-center" role="status">
        <!-- Checking with Paystack -->
        <template v-if="state === 'checking'">
          <NIconBlob icon="spinner" tone="sky" class="size-20 [&_svg]:animate-spin" />
          <h1 id="complete-title" class="font-display mt-6 text-3xl font-semibold text-forest-900">
            Confirming your payment…
          </h1>
          <p class="mt-3 text-base-600">This only takes a moment. Please don't close this page.</p>
        </template>

        <!-- Paid -->
        <template v-else-if="state === 'paid' && order">
          <NIconBlob icon="check" tone="mint" class="size-20" />
          <h1 id="complete-title" class="font-display mt-6 text-3xl font-semibold text-forest-900">
            Thank you! Your order is confirmed
          </h1>
          <p class="mt-3 text-base-600">
            We've received your payment of
            <strong class="text-base-900">{{ formatMoney(order.total) }}</strong>. Paystack has
            emailed your receipt to <strong class="text-base-900">{{ order.email }}</strong>, and
            we'll be in touch to confirm the details of your books.
          </p>
          <p class="mt-2 text-sm text-base-550">Order reference: {{ order.reference }}</p>
          <ul role="list" class="mt-6 flex flex-col gap-1 font-bold text-forest-900">
            <li v-for="(b, i) in order.books" :key="i">{{ b.quantity }}× {{ b.title }}</li>
          </ul>
          <NButton :to="ROUTES.storybookCreate" variant="ghost" color="brand" class="mt-8"
            >Create another storybook</NButton
          >
        </template>

        <!-- Not paid / can't confirm -->
        <template v-else>
          <NIconBlob icon="warning" tone="coral" class="size-20" />
          <h1 id="complete-title" class="font-display mt-6 text-3xl font-semibold text-forest-900">
            Payment not confirmed
          </h1>
          <p class="mt-3 text-base-600">{{ message }}</p>
          <p v-if="reference" class="mt-2 text-sm text-base-550">Reference: {{ reference }}</p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <NButton :to="ROUTES.cart" color="coral">Back to cart</NButton>
            <NButton :to="ROUTES.contact" variant="ghost" color="brand">Contact us</NButton>
          </div>
        </template>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import type { PaidOrder } from "../../domain/cart-types";

/**
 * Paystack sends the customer back here with ?reference=…. The page asks OUR server to verify it
 * with Paystack (never trusting the redirect alone), then empties the cart.
 */
const { confirmPayment } = useCheckout();
const cart = useCart();

const state = ref<"checking" | "paid" | "failed">("checking");
const order = ref<PaidOrder | null>(null);
const message = ref("");
const reference = ref("");

/**
 * Read ?reference from the ROUTE, not window.location: while a prerendered page hydrates, the
 * router briefly replaces the address without its query string, and reading it at that moment
 * found no reference, so no payment could ever be confirmed (or emailed).
 */
const route = useRoute();
const paramOf = () =>
  String(route.query.reference ?? route.query.trxref ?? "") ||
  new URLSearchParams(window.location.search).get("reference") ||
  new URLSearchParams(window.location.search).get("trxref") ||
  "";

onMounted(async () => {
  reference.value = paramOf();
  // Give hydration a moment to settle before concluding there's no reference.
  for (let i = 0; !reference.value && i < 10; i++) {
    await new Promise((r) => setTimeout(r, 100));
    reference.value = paramOf();
  }
  if (!reference.value) {
    state.value = "failed";
    message.value = "We couldn't find a payment to confirm.";
    return;
  }
  try {
    order.value = await confirmPayment(reference.value);
    state.value = "paid";
    cart.clear();
  } catch (error) {
    state.value = "failed";
    message.value = error instanceof Error ? error.message : "We couldn't confirm the payment.";
  }
});
</script>
