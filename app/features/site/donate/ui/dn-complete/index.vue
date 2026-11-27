<template>
  <NSection
    tone="cream"
    spacing="none"
    labelledby="gift-complete-title"
    class="min-h-[70vh] py-12 md:py-16"
  >
    <NContainer>
      <div class="mx-auto flex max-w-lg flex-col items-center text-center" role="status">
        <!-- Checking with Paystack -->
        <template v-if="state === 'checking'">
          <NIconBlob icon="spinner" tone="sky" class="size-20 [&_svg]:animate-spin" />
          <h1
            id="gift-complete-title"
            class="font-display mt-6 text-3xl font-semibold text-forest-900"
          >
            Confirming your gift…
          </h1>
          <p class="mt-3 text-base-600">This only takes a moment. Please don't close this page.</p>
        </template>

        <!-- Paid -->
        <template v-else-if="state === 'paid' && gift">
          <NIconBlob icon="heart" tone="coral" class="size-20" />
          <h1
            id="gift-complete-title"
            class="font-display mt-6 text-3xl font-semibold text-forest-900"
          >
            Thank you{{ gift.name ? `, ${gift.name}` : "" }}!
          </h1>
          <p class="mt-3 text-base-600">
            We've received your gift of
            <strong class="text-base-900"
              >{{ formatMoney(gift.amount) }}{{ gift.frequency === "monthly" ? " a month" : "" }}</strong
            >
            for <strong class="text-base-900">{{ gift.target }}</strong>. We've emailed your receipt
            to <strong class="text-base-900">{{ gift.email }}</strong>.
          </p>
          <p v-if="gift.frequency === 'monthly'" class="mt-3 text-sm text-base-600">
            Your card will be charged the same amount each month. To change or stop your monthly
            gift, just reply to the receipt email.
          </p>
          <p class="mt-2 text-sm text-base-550">Reference: {{ gift.reference }}</p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <NButton :to="ROUTES.causes" color="brand">See our causes</NButton>
            <NButton :to="ROUTES.home" variant="ghost" color="brand">Back to home</NButton>
          </div>
        </template>

        <!-- Not paid / can't confirm -->
        <template v-else>
          <NIconBlob icon="warning" tone="coral" class="size-20" />
          <h1
            id="gift-complete-title"
            class="font-display mt-6 text-3xl font-semibold text-forest-900"
          >
            Gift not confirmed
          </h1>
          <p class="mt-3 text-base-600">{{ message }}</p>
          <p v-if="reference" class="mt-2 text-sm text-base-550">Reference: {{ reference }}</p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <NButton :to="ROUTES.donate" color="coral">Try again</NButton>
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
import type { PaidDonation } from "../../domain/donate-types";

/**
 * Paystack sends the donor back here with ?reference=…. The page asks OUR server to verify it
 * with Paystack (never trusting the redirect alone). Same handling as the storybook
 * confirmation: the reference is read from the ROUTE (not window.location, which is briefly
 * without its query while a prerendered page hydrates), kept for this tab, and removed from the
 * address bar.
 */
const { confirmPayment } = useDonate();

const state = ref<"checking" | "paid" | "failed">("checking");
const gift = ref<PaidDonation | null>(null);
const message = ref("");
const reference = ref("");

const route = useRoute();
const router = useRouter();
const paramOf = () =>
  String(route.query.reference ?? route.query.trxref ?? "") ||
  new URLSearchParams(window.location.search).get("reference") ||
  new URLSearchParams(window.location.search).get("trxref") ||
  "";

const SESSION_KEY = "bv-gift-reference";
const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) ?? "";
  } catch {
    return "";
  }
};
function keepForThisTab(ref: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, ref);
  } catch {
    // Private mode: a reload just won't remember it.
  }
}

// Don't send this page's address to any other site (e.g. in a Referer header).
useHead({ meta: [{ name: "referrer", content: "no-referrer" }] });

onMounted(async () => {
  reference.value = paramOf();
  for (let i = 0; !reference.value && i < 10; i++) {
    await new Promise((r) => setTimeout(r, 100));
    reference.value = paramOf();
  }
  if (reference.value) {
    keepForThisTab(reference.value);
    await router.replace({ query: {} });
  } else {
    reference.value = readSession();
  }
  if (!reference.value) {
    state.value = "failed";
    message.value = "We couldn't find a gift to confirm.";
    return;
  }
  try {
    gift.value = await confirmPayment(reference.value);
    state.value = "paid";
  } catch (error) {
    state.value = "failed";
    message.value = error instanceof Error ? error.message : "We couldn't confirm the payment.";
  }
});
</script>
