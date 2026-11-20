<template>
  <div>
    <NPageHero eyebrow="Send Relief" :breadcrumbs="[{ label: 'Donate' }]">
      Give a child the future <NHeadingHighlight>they deserve</NHeadingHighlight>
      <template #lead>
        Your gift supports books for out-of-school children, healthy food and clean water. Give once
        or monthly, in Naira or your own currency.
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="Make a pledge">
      <NContainer class="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <NCard class="p-6 sm:p-8">
          <div v-if="pledged" role="status" class="flex flex-col items-center py-10 text-center">
            <NIconBlob icon="heart" tone="coral" class="size-20" />
            <h2 class="font-display mt-5 text-2xl font-semibold text-forest-900">
              Thank you, {{ pledged.name }}!
            </h2>
            <p class="mt-3 max-w-md text-base-600">
              We've recorded your pledge of
              <strong class="text-base-900">{{
                formatMoney(pledged.amount, pledged.currency)
              }}</strong>
              {{ pledged.frequency === "monthly" ? "a month" : "" }}. Our team will email
              <strong class="text-base-900">{{ pledged.email }}</strong> with how to complete your
              gift.
            </p>
            <NButton class="mt-6" variant="ghost" color="brand" @click="pledged = null"
              >Make another pledge</NButton
            >
          </div>

          <form v-else class="grid gap-6" novalidate @submit.prevent="onSubmit">
            <div
              class="flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-base-900"
              role="note"
            >
              <NIcon name="info" size="1.4rem" class="shrink-0 text-sky-700" />
              <p>
                <strong>Secure online payment is coming soon.</strong> For now, pledge your gift
                here and we'll email you how to complete it.
              </p>
            </div>

            <NChoiceGroup
              v-model="frequency"
              legend="How often?"
              name="frequency"
              :options="FREQUENCIES"
            />

            <NField v-slot="f" label="Give to" :error="errors.target">
              <NSelect
                :id="f.id"
                v-model="target"
                :options="DONATION_TARGETS"
                :aria-describedby="f.describedby"
                :invalid="f.invalid"
              />
            </NField>

            <NChoiceGroup
              v-model="currency"
              legend="Currency"
              name="currency"
              :options="SUPPORTED_CURRENCIES.map((c) => ({ value: c, label: c }))"
            />

            <fieldset class="grid gap-2">
              <legend class="mb-1.5 text-sm font-bold text-base-900">Amount</legend>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  v-for="preset in presets"
                  :key="preset"
                  type="button"
                  :aria-pressed="amount === preset"
                  :class="
                    cn(
                      'flex min-h-12 cursor-pointer items-center justify-center rounded-xl border font-bold transition-colors',
                      amount === preset
                        ? 'border-forest-500 bg-forest-500 text-base-0'
                        : 'border-base-500 bg-base-0 text-base-900 hover:border-forest-500',
                    )
                  "
                  @click="amount = preset"
                >
                  {{ formatMoney(preset, currency as Currency) }}
                </button>
              </div>
              <NField
                v-slot="f"
                label="Or enter another amount"
                :error="errors.amount"
                class="mt-2"
              >
                <NInput
                  :id="f.id"
                  v-model="amountText"
                  inputmode="decimal"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
            </fieldset>

            <div class="grid gap-5 sm:grid-cols-2">
              <NField v-slot="f" label="Your name" :error="errors.name">
                <NInput
                  :id="f.id"
                  v-model="name"
                  v-bind="nameAttrs"
                  autocomplete="name"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
              <NField v-slot="f" label="Email" :error="errors.email">
                <NInput
                  :id="f.id"
                  v-model="email"
                  v-bind="emailAttrs"
                  type="email"
                  autocomplete="email"
                  :aria-describedby="f.describedby"
                  :invalid="f.invalid"
                />
              </NField>
            </div>

            <NButton type="submit" size="lg" :disabled="isSubmitting || isPending" class="w-full">
              <NIcon
                :name="isSubmitting || isPending ? 'spinner' : 'heart'"
                weight="fill"
                :class="(isSubmitting || isPending) && 'animate-spin'"
              />
              {{ isSubmitting || isPending ? "Sending…" : submitLabel }}
            </NButton>
            <p class="text-center text-xs text-base-550">
              No payment is taken on this page. See our
              <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2"
                >privacy policy</NuxtLink
              >.
            </p>
          </form>
        </NCard>

        <aside aria-label="Why give" class="grid content-start gap-4">
          <NBlobImage
            :image="IMAGE"
            mask="blob-2"
            sizes="xs:92vw sm:92vw md:36vw"
            class="aspect-[1.15] w-full"
          />
          <h2 class="font-display mt-4 text-2xl font-semibold text-forest-900">
            Where your gift goes
          </h2>
          <ul role="list" class="grid gap-3">
            <li v-for="item in WHERE" :key="item.title" class="flex items-start gap-3">
              <NIconBlob :icon="item.icon" :tone="item.tone" class="size-11" />
              <div>
                <h3 class="font-bold text-base-900">{{ item.title }}</h3>
                <p class="text-sm text-base-550">{{ item.text }}</p>
              </div>
            </li>
          </ul>
          <p class="mt-2 text-sm text-base-550">
            Prefer to talk to someone? Call
            <NLink
              :to="SITE_INFO.phones[0].href"
              class="font-bold text-forest-500 underline underline-offset-4"
              >{{ SITE_INFO.phones[0].display }}</NLink
            >
            or
            <NuxtLink
              :to="ROUTES.contact"
              class="font-bold text-forest-500 underline underline-offset-4"
              >contact us</NuxtLink
            >.
          </p>
        </aside>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { photo } from "~/shared/photos";
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";
import { formatMoney, SUPPORTED_CURRENCIES, type Currency } from "~/utils/format-money";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import {
  DONATION_TARGETS,
  FREQUENCIES,
  parseTarget,
  pledgeSchema,
  PRESET_AMOUNTS,
  type DonationPledge,
} from "../../domain/donate-types";

const route = useRoute();
const { pledge, isPending } = useDonate();
const pledged = ref<DonationPledge | null>(null);

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(pledgeSchema),
  initialValues: {
    target: "greatest-need",
    currency: "NGN",
    frequency: "once",
    amount: PRESET_AMOUNTS.NGN[1],
  },
});
const [target] = defineField("target");
// The page is prerendered without a query string, so ?cause=… is applied after mount
// (applying it during setup would make the server and client HTML disagree).
onMounted(() => {
  target.value = parseTarget(route.query.cause);
});
const [currency] = defineField("currency");
const [frequency] = defineField("frequency");
const [amount] = defineField("amount");
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");

const presets = computed(() => PRESET_AMOUNTS[(currency.value ?? "NGN") as Currency]);
// Switching currency resets the amount to that currency's second preset.
watch(currency, (c) => (amount.value = PRESET_AMOUNTS[(c ?? "NGN") as Currency][1]));

/** Free-text amount, kept in sync with the numeric field (empty when a preset is chosen). */
const amountText = computed({
  get: () => (amount.value && !presets.value.includes(amount.value) ? String(amount.value) : ""),
  set: (v: string) => {
    const n = Number(v.replace(/[^\d.]/g, ""));
    amount.value = v.trim() === "" || Number.isNaN(n) ? undefined : n;
  },
});

const submitLabel = computed(() => {
  const value = amount.value
    ? formatMoney(amount.value, (currency.value ?? "NGN") as Currency)
    : "";
  return `Pledge ${value}${frequency.value === "monthly" ? " a month" : ""}`.replace("  ", " ");
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await pledge(values);
    pledged.value = values;
    resetForm();
  } catch (error) {
    push.error({
      title: "Couldn't record your pledge",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});

const IMAGE = photo("/images/donate/hero.jpg", "boysInUniform", "Children smiling");
const WHERE: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Education",
    text: "New books and supplies for out-of-school children.",
    icon: "education",
    tone: "sky",
  },
  { title: "Health", text: "Healthy food for vulnerable families.", icon: "food", tone: "coral" },
  {
    title: "Clean water",
    text: "Portable, clean water for communities in Lokoja.",
    icon: "water",
    tone: "mint",
  },
];
</script>
