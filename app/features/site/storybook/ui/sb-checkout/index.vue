<template>
  <NSection
    tone="cream"
    spacing="none"
    labelledby="checkout-title"
    class="min-h-[70vh] py-8 md:py-12"
  >
    <NContainer>
      <div class="mx-auto max-w-5xl">
        <NuxtLink
          :to="ROUTES.cart"
          class="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-forest-500 hover:bg-base-100"
        >
          <NIcon name="arrowLeft" /> Back to cart
        </NuxtLink>
        <h1
          id="checkout-title"
          class="font-display mt-2 text-3xl font-semibold text-forest-900 md:text-4xl"
        >
          Checkout
        </h1>

        <p v-if="!ready" class="mt-8 text-base-550">Loading your cart…</p>

        <NEmptyState
          v-else-if="!items.length"
          icon="books"
          tone="coral"
          title="Your cart is empty"
          class="mt-8"
        >
          Add a storybook to your cart before checking out.
          <template #actions>
            <NButton :to="ROUTES.storybookCreate" color="coral">Create a storybook</NButton>
          </template>
        </NEmptyState>

        <form
          v-else
          class="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
          novalidate
          @submit.prevent="onPay"
        >
          <div class="flex min-w-0 flex-col gap-6">
            <!-- Contact -->
            <fieldset
              class="grid min-w-0 gap-5 rounded-3xl bg-base-0 p-6 shadow-soft sm:grid-cols-2"
            >
              <legend class="font-display float-left mb-1 text-xl font-semibold text-forest-900">
                Your details
              </legend>
              <NField v-slot="f" label="Full name" :error="errors.fullName" class="sm:col-span-2">
                <NInput
                  :id="f.id"
                  v-model="fullName"
                  autocomplete="name"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-slot="f" label="Email" :error="errors.email" hint="Your receipt goes here.">
                <NInput
                  :id="f.id"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-slot="f" label="Phone" :error="errors.phone" hint="For the delivery rider.">
                <NInput
                  :id="f.id"
                  v-model="phone"
                  type="tel"
                  autocomplete="tel"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
            </fieldset>

            <!-- Delivery -->
            <fieldset
              class="grid min-w-0 gap-5 rounded-3xl bg-base-0 p-6 shadow-soft sm:grid-cols-2"
            >
              <legend class="font-display float-left mb-1 text-xl font-semibold text-forest-900">
                Delivery
              </legend>
              <div class="sm:col-span-2">
                <p id="zone-label" class="mb-2 text-sm font-bold text-base-900">Deliver to</p>
                <div role="radiogroup" aria-labelledby="zone-label" class="grid grid-cols-2 gap-3">
                  <label v-for="z in ZONES" :key="z.value" class="relative">
                    <input
                      v-model="zone"
                      type="radio"
                      name="zone"
                      :value="z.value"
                      class="peer sr-only"
                    />
                    <span
                      class="flex min-h-14 cursor-pointer flex-col justify-center rounded-2xl border border-base-500 px-4 py-2 text-sm transition-colors peer-checked:border-coral-600 peer-checked:bg-coral-50 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)] hover:border-coral-500"
                    >
                      <span class="font-bold text-base-900">{{ z.label }}</span>
                      <span class="text-base-550">{{ feeText(z.value) }}</span>
                    </span>
                  </label>
                </div>
              </div>
              <NField
                v-if="zone === 'international'"
                v-slot="f"
                label="Country"
                :error="errors.country"
                class="sm:col-span-2"
              >
                <NInput
                  :id="f.id"
                  v-model="country"
                  autocomplete="country-name"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField
                v-slot="f"
                label="Street address"
                :error="errors.address"
                class="sm:col-span-2"
              >
                <NInput
                  :id="f.id"
                  v-model="address"
                  autocomplete="street-address"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-slot="f" label="Town or city" :error="errors.city">
                <NInput
                  :id="f.id"
                  v-model="city"
                  autocomplete="address-level2"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-if="zone === 'nigeria'" v-slot="f" label="State" :error="errors.state">
                <NSelect
                  :id="f.id"
                  v-model="state"
                  :options="STATE_OPTIONS"
                  placeholder="Choose a state"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-else v-slot="f" label="State, province or region" :error="errors.state">
                <NInput
                  :id="f.id"
                  v-model="state"
                  autocomplete="address-level1"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-slot="f" label="Postcode" optional :error="errors.postcode">
                <NInput
                  :id="f.id"
                  v-model="postcode"
                  autocomplete="postal-code"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField
                v-slot="f"
                label="Delivery notes"
                optional
                :error="errors.notes"
                class="sm:col-span-2"
              >
                <NTextarea
                  :id="f.id"
                  v-model="notes"
                  :rows="2"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
            </fieldset>
          </div>

          <!-- Summary + pay -->
          <aside
            aria-labelledby="summary-title"
            class="rounded-3xl bg-base-0 p-6 shadow-soft lg:sticky lg:top-24"
          >
            <h2 id="summary-title" class="font-display text-xl font-semibold text-forest-900">
              Order summary
            </h2>
            <ul role="list" class="mt-4 flex flex-col gap-2 border-b border-base-150 pb-4 text-sm">
              <li v-for="item in items" :key="item.key" class="flex justify-between gap-3">
                <span class="text-base-600">{{ item.quantity }}× {{ item.title }}</span>
              </li>
            </ul>
            <dl class="mt-4 flex flex-col gap-2 text-base-600">
              <div class="flex justify-between gap-4">
                <dt>Books</dt>
                <dd class="font-bold text-base-900">
                  {{ money(totals.subtotal, pricing.bookPrice) }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>Delivery</dt>
                <dd class="font-bold text-base-900">{{ deliveryText }}</dd>
              </div>
              <div class="mt-2 flex justify-between gap-4 border-t border-base-150 pt-3 text-lg">
                <dt class="font-bold text-base-900">Total</dt>
                <dd class="font-bold text-base-900">
                  {{ chargeable ? formatMoney(totals.total) : "—" }}
                </dd>
              </div>
            </dl>

            <NButton
              type="submit"
              size="lg"
              color="coral"
              class="mt-6 h-auto min-h-14 w-full py-3 whitespace-normal"
              :disabled="!chargeable || isStarting || isSubmitting"
            >
              <NIcon
                :name="isStarting || isSubmitting ? 'spinner' : 'accountable'"
                :class="(isStarting || isSubmitting) && 'animate-spin'"
              />
              {{
                isStarting || isSubmitting
                  ? "Opening Paystack…"
                  : `Pay ${chargeable ? formatMoney(totals.total) : ""} with Paystack`
              }}
            </NButton>
            <p v-if="!chargeable" class="mt-3 text-sm text-base-550">
              {{
                staticSite
                  ? "Online payment isn't available on this site yet."
                  : "Online ordering for this delivery option opens soon."
              }}
              To order now,
              <NuxtLink :to="ROUTES.contact" class="underline underline-offset-2"
                >contact us</NuxtLink
              >.
            </p>
            <p v-else class="mt-3 text-xs text-base-550">
              You'll pay on Paystack's secure page (card, bank transfer or USSD), then come back
              here. We never see your card details. By paying you agree to our
              <NuxtLink :to="ROUTES.terms" class="underline underline-offset-2">Terms</NuxtLink>.
            </p>
          </aside>
        </form>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import {
  canCharge,
  cartTotals,
  checkoutSchema,
  isPriceSet,
  NIGERIAN_STATES,
  type DeliveryZone,
} from "../../domain/cart-types";

const { items, ready, pricing } = useCart();
const { startPayment, isStarting } = useCheckout();

const ZONES: { value: DeliveryZone; label: string }[] = [
  { value: "nigeria", label: "Nigeria" },
  { value: "international", label: "Another country" },
];
const STATE_OPTIONS = NIGERIAN_STATES.map((s) => ({ value: s, label: s }));

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(checkoutSchema),
  initialValues: { zone: "nigeria", state: "" },
});
const [fullName] = defineField("fullName");
const [email] = defineField("email");
const [phone] = defineField("phone");
const [zone] = defineField("zone");
const [country] = defineField("country");
const [state] = defineField("state");
const [city] = defineField("city");
const [address] = defineField("address");
const [postcode] = defineField("postcode");
const [notes] = defineField("notes");

// Nigerian states and foreign regions are different lists: clear the field when switching.
watch(zone, () => (state.value = ""));

const currentZone = computed<DeliveryZone>(() => zone.value ?? "nigeria");
const totals = computed(() => cartTotals(items.value, pricing, currentZone.value));
/** A static upload (no server) can't reach Paystack, so it never offers to pay. */
const staticSite = useRuntimeConfig().public.staticSite;
const chargeable = computed(() => !staticSite && canCharge(pricing, currentZone.value));

const fee = (z: DeliveryZone) =>
  z === "nigeria" ? pricing.deliveryNigeria : pricing.deliveryInternational;
function feeText(z: DeliveryZone) {
  const f = fee(z);
  return !isPriceSet(f) ? "Fee coming soon" : f === 0 ? "Free delivery" : formatMoney(f);
}
const deliveryText = computed(() => {
  const f = fee(currentZone.value);
  return !isPriceSet(f) ? "Coming soon" : f === 0 ? "Free" : formatMoney(f);
});
const money = (amount: number, unit: number) => (unit > 0 ? formatMoney(amount) : "Coming soon");

const onPay = handleSubmit(async (values) => {
  try {
    const url = await startPayment(values, items.value);
    window.location.assign(url); // Paystack's hosted page; it returns to /checkout/complete
  } catch (error) {
    push.error({
      title: "Couldn't open the payment",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
