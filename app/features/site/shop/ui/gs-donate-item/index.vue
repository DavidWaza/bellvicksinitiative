<template>
  <div>
    <NPageHero
      eyebrow="The Giving Shop"
      :breadcrumbs="[{ label: 'Shop', to: ROUTES.shop }, { label: 'Donate an item' }]"
    >
      Donate an <NHeadingHighlight>item</NHeadingHighlight>
      <template #lead>
        Give something you no longer need. We sell it in The Giving Shop, and the proceeds go to
        humanitarian work for children and communities across Nigeria.
      </template>
    </NPageHero>

    <NSection tone="white" spacing="none" aria-label="Donate an item" class="py-12 md:py-16">
      <NContainer class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <!-- THE RULE, said boldly -->
          <div
            class="flex items-start gap-4 rounded-3xl border-2 border-accent-500 bg-accent-50 p-5 sm:p-6"
            role="note"
          >
            <NIconBlob icon="tag" tone="accent" class="size-14 shrink-0" />
            <div>
              <p class="font-display text-xl leading-snug font-bold text-base-950 sm:text-2xl">
                Donated items must be resellable.
              </p>
              <p class="mt-1 text-base-700">
                Clean, complete and in good working order: something you'd be happy to buy
                yourself. We can't accept damaged, broken or heavily worn items.
              </p>
            </div>
          </div>

          <!-- Sent -->
          <div
            v-if="reference"
            role="status"
            class="mt-8 flex flex-col items-center rounded-3xl bg-mint-50 px-6 py-12 text-center"
          >
            <NIconBlob icon="check" tone="mint" class="size-20" />
            <h2 class="font-display mt-5 text-3xl font-semibold text-forest-900">
              Thank you, {{ sentName }}!
            </h2>
            <p class="mt-3 max-w-md text-base-600">
              We've received your offer. Our team will look at the photos and message you on
              WhatsApp to arrange the {{ sentHandover === "pickup" ? "pickup" : "drop-off" }}.
            </p>
            <p class="mt-3 text-sm text-base-550">Reference: {{ reference }}</p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <NButton color="brand" @click="startAgain">Donate another item</NButton>
              <NButton :to="ROUTES.shop" variant="ghost" color="brand">Back to the shop</NButton>
            </div>
          </div>

          <form v-else class="mt-8 grid gap-10" novalidate @submit.prevent="onSubmit">
            <!-- 1. The item -->
            <section class="grid gap-5" aria-labelledby="step-item">
              <gs-donate-item-step id="step-item" :n="1" title="What are you donating?" />
              <div class="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <NField v-slot="f" label="Item" :error="errors.itemName" hint="e.g. Children's school shoes, size 32">
                  <NInput :id="f.id" v-model="itemName" v-bind="itemNameAttrs" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <NField v-slot="f" label="How many?" :error="errors.quantity">
                  <NInput :id="f.id" v-model="quantityText" type="number" inputmode="numeric" min="1" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
              </div>
              <NField v-slot="f" label="Category" :error="errors.category">
                <NSelect :id="f.id" v-model="category" :options="ITEM_CATEGORIES" placeholder="Choose a category" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
              <NChoiceGroup v-model="condition" legend="Condition" name="condition" :options="ITEM_CONDITIONS" :error="errors.condition" />
              <NField v-slot="f" label="Describe it" optional :error="errors.description" hint="Size, colour, brand, what's included, any small marks.">
                <NTextarea :id="f.id" v-model="description" :rows="3" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
              <NField v-slot="f" label="Roughly what is it worth?" optional :error="errors.estimatedValue" hint="Helps us price it fairly, e.g. ₦15,000.">
                <NInput :id="f.id" v-model="estimatedValue" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
            </section>

            <!-- 2. Photos -->
            <section class="grid gap-5" aria-labelledby="step-photos">
              <gs-donate-item-step id="step-photos" :n="2" title="Add photos" />
              <gs-donate-item-photos v-model="photos" :max="MAX_ITEM_PHOTOS" :error="photosError" />
            </section>

            <!-- 3. Receipt -->
            <section class="grid gap-5" aria-labelledby="step-receipt">
              <gs-donate-item-step id="step-receipt" :n="3" title="Do you have the receipt?" />
              <NChoiceGroup v-model="hasReceipt" legend="Receipt" name="hasReceipt" :options="RECEIPT_CHOICES" :error="errors.hasReceipt" />
              <gs-donate-item-file
                v-if="hasReceipt === 'yes'"
                id="receipt-file"
                v-model="receipt"
                label="Proof of the receipt"
                required
                :error="receiptError"
                hint="A photo or scan of the receipt (JPG, PNG, WebP or PDF, up to 2 MB)."
              />
              <template v-if="hasReceipt === 'no'">
                <NField v-slot="f" label="Why not, and is there any proof it's genuine?" :error="errors.noReceiptReason" hint="e.g. It was a gift; it still has its tags; I have the box and warranty card.">
                  <NTextarea :id="f.id" v-model="noReceiptReason" :rows="3" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <gs-donate-item-file
                  id="proof-file"
                  v-model="proof"
                  label="Proof of authenticity"
                  :error="receiptError"
                  hint="A photo of a tag, label, box, warranty card or serial number (photo or PDF, up to 2 MB)."
                />
              </template>
            </section>

            <!-- 4. Location -->
            <section class="grid gap-5" aria-labelledby="step-where">
              <gs-donate-item-step id="step-where" :n="4" title="Where is the item?" />
              <NChoiceGroup v-model="handover" legend="Pickup or drop-off" name="handover" :options="HANDOVER_OPTIONS" :error="errors.handover" />
              <NField v-if="handover === 'pickup'" v-slot="f" label="Pickup address" :error="errors.address" hint="Street, area and any landmark.">
                <NTextarea :id="f.id" v-model="address" :rows="2" autocomplete="street-address" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
              <div class="grid gap-5 sm:grid-cols-2">
                <NField v-slot="f" label="City or town" :error="errors.city">
                  <NInput :id="f.id" v-model="city" autocomplete="address-level2" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <NField v-slot="f" label="State" :error="errors.state">
                  <NInput :id="f.id" v-model="state" autocomplete="address-level1" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
              </div>
            </section>

            <!-- 5. Contact -->
            <section class="grid gap-5" aria-labelledby="step-you">
              <gs-donate-item-step id="step-you" :n="5" title="Your details" />
              <NChoiceGroup v-model="donorKind" legend="Donating as" name="donorKind" :options="DONOR_KINDS" />
              <NField v-if="donorKind === 'organisation'" v-slot="f" label="Organisation name" :error="errors.organisation">
                <NInput :id="f.id" v-model="organisation" autocomplete="organization" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
              <div class="grid gap-5 sm:grid-cols-2">
                <NField v-slot="f" label="Contact person's full name" :error="errors.fullName">
                  <NInput :id="f.id" v-model="fullName" autocomplete="name" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <NField v-slot="f" label="WhatsApp number" :error="errors.whatsapp" hint="We'll message you here to arrange things.">
                  <NInput :id="f.id" v-model="whatsapp" type="tel" autocomplete="tel" inputmode="tel" placeholder="+234 …" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <NField v-slot="f" label="Email" optional :error="errors.email">
                  <NInput :id="f.id" v-model="email" type="email" autocomplete="email" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
                <NField v-slot="f" label="Best time to reach you" optional :error="errors.bestTime">
                  <NInput :id="f.id" v-model="bestTime" placeholder="e.g. Weekdays after 4pm" :aria-describedby="f.describedby" :invalid="f.invalid" />
                </NField>
              </div>
              <NField v-slot="f" label="Anything else we should know?" optional :error="errors.notes">
                <NTextarea :id="f.id" v-model="notes" :rows="3" :aria-describedby="f.describedby" :invalid="f.invalid" />
              </NField>
            </section>

            <!-- Confirm and send -->
            <div class="grid gap-4 rounded-3xl bg-base-50 p-5 sm:p-6">
              <label class="flex cursor-pointer items-start gap-3">
                <input v-model="resellable" type="checkbox" class="mt-0.5 size-5 shrink-0 cursor-pointer accent-forest-500" :aria-invalid="Boolean(errors.resellable) || undefined" />
                <span class="text-sm text-base-900">
                  <strong>I confirm the item is in good, resellable condition</strong>, it's mine
                  (or my organisation's) to give, and I'm happy for it to be sold to fund
                  humanitarian work.
                </span>
              </label>
              <p v-if="errors.resellable" role="alert" class="text-sm font-medium text-red-600">
                {{ errors.resellable }}
              </p>
              <NButton type="submit" size="lg" class="w-full sm:w-auto" :disabled="busy">
                <NIcon :name="busy ? 'spinner' : 'gift'" weight="duotone" :class="busy && 'animate-spin'" />
                {{ busy ? "Sending…" : "Send my donation offer" }}
              </NButton>
              <p class="text-xs text-base-550">
                We use these details only to arrange your donation. See our
                <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2">privacy policy</NuxtLink>.
              </p>
            </div>
          </form>
        </div>

        <!-- Guidance -->
        <aside aria-label="About donating items" class="grid gap-5 lg:sticky lg:top-28">
          <div class="rounded-3xl bg-mint-50 p-6">
            <h2 class="font-display text-xl font-semibold text-forest-900">What happens next</h2>
            <ol role="list" class="mt-4 grid gap-4">
              <li v-for="(s, i) in NEXT" :key="s" class="flex items-start gap-3">
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-forest-500 text-sm font-bold text-base-0">{{ i + 1 }}</span>
                <span class="pt-1 text-sm text-base-700">{{ s }}</span>
              </li>
            </ol>
          </div>
          <div class="rounded-3xl bg-base-50 p-6">
            <h2 class="font-display text-xl font-semibold text-forest-900">Good to give</h2>
            <ul role="list" class="mt-3 grid gap-2 text-sm text-base-700">
              <li v-for="g in GOOD" :key="g" class="flex items-start gap-2">
                <NIcon name="check" weight="fill" class="mt-0.5 text-forest-500" /> {{ g }}
              </li>
            </ul>
            <h2 class="font-display mt-5 text-xl font-semibold text-forest-900">Please don't send</h2>
            <ul role="list" class="mt-3 grid gap-2 text-sm text-base-700">
              <li v-for="b in NOT" :key="b" class="flex items-start gap-2">
                <NIcon name="xCircle" weight="fill" class="mt-0.5 text-coral-700" /> {{ b }}
              </li>
            </ul>
          </div>
        </aside>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import {
  DONOR_KINDS,
  HANDOVER_OPTIONS,
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  itemDonationSchema,
  MAX_ITEM_PHOTOS,
  MAX_RECEIPT_BYTES,
} from "../../domain/item-donation";

const { submit, isPending } = useItemDonation();

const RECEIPT_CHOICES: { value: string; label: string; description: string; icon: IconName }[] = [
  { value: "yes", label: "Yes, I have it", description: "Upload a photo or PDF of it.", icon: "check" },
  { value: "no", label: "No receipt", description: "Tell us why, and any proof it's genuine.", icon: "info" },
];
const NEXT = [
  "We look at your photos and details.",
  "We message you on WhatsApp to arrange pickup or drop-off.",
  "Your item goes on sale in The Giving Shop.",
  "The proceeds go to humanitarian work for children and communities.",
];
const GOOD = [
  "New or like-new clothing, shoes and bags",
  "Books, stationery and school supplies",
  "Home and kitchen items in working order",
  "Toys and games with all their parts",
];
const NOT = [
  "Damaged, stained or broken items",
  "Items with missing parts",
  "Anything that isn't yours to give",
];

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(itemDonationSchema),
  initialValues: { quantity: 1, donorKind: "person", resellable: false },
});
const [itemName, itemNameAttrs] = defineField("itemName");
const [quantity] = defineField("quantity");
/** The input holds text; the form holds a number. */
const quantityText = computed({
  get: () => (quantity.value === undefined ? "" : String(quantity.value)),
  // A number input's v-model hands back a number (Vue casts type="number"), or "" when empty.
  set: (v: string | number) =>
    (quantity.value = String(v).trim() === "" ? undefined : Number(v)),
});
const [category] = defineField("category");
const [condition] = defineField("condition");
const [description] = defineField("description");
const [estimatedValue] = defineField("estimatedValue");
const [hasReceipt] = defineField("hasReceipt");
const [noReceiptReason] = defineField("noReceiptReason");
const [handover] = defineField("handover");
const [address] = defineField("address");
const [city] = defineField("city");
const [state] = defineField("state");
const [donorKind] = defineField("donorKind");
const [organisation] = defineField("organisation");
const [fullName] = defineField("fullName");
const [whatsapp] = defineField("whatsapp");
const [email] = defineField("email");
const [bestTime] = defineField("bestTime");
const [notes] = defineField("notes");
const [resellable] = defineField("resellable");

// Files live outside vee-validate (they're Blobs, not form values); checked on submit.
const photos = ref<File[]>([]);
const receipt = ref<File | null>(null);
const proof = ref<File | null>(null);
const photosError = ref("");
const receiptError = ref("");
watch(photos, () => (photosError.value = ""), { deep: true });
watch([receipt, proof, hasReceipt], () => (receiptError.value = ""));

const busy = computed(() => isSubmitting.value || isPending.value);
const reference = ref("");
const sentName = ref("");
const sentHandover = ref("");

function filesOk(): boolean {
  photosError.value = photos.value.length ? "" : "Please add at least one photo of the item.";
  const doc = hasReceipt.value === "yes" ? receipt.value : hasReceipt.value === "no" ? proof.value : null;
  if (hasReceipt.value === "yes" && !receipt.value)
    receiptError.value = "Please add a photo or PDF of the receipt.";
  else if (doc && doc.size > MAX_RECEIPT_BYTES)
    receiptError.value = "That file is larger than 2 MB. Please use a smaller photo or PDF.";
  return !photosError.value && !receiptError.value;
}

const onSubmit = handleSubmit(
  async (values) => {
    if (!filesOk()) return;
    try {
      reference.value = await submit({
        data: values,
        photos: photos.value,
        receipt: values.hasReceipt === "yes" ? receipt.value : null,
        proof: values.hasReceipt === "no" ? proof.value : null,
      });
      sentName.value = values.fullName.split(/\s+/)[0] ?? "";
      sentHandover.value = values.handover;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      push.error({
        title: "Couldn't send your offer",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  },
  () => {
    filesOk();
    push.error({ title: "Please check the form", message: "Some details need your attention." });
  },
);

function startAgain() {
  resetForm();
  photos.value = [];
  receipt.value = null;
  proof.value = null;
  reference.value = "";
}
</script>
