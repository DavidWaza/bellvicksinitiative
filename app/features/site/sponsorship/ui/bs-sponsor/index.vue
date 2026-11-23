<template>
  <bs-form-shell crumb="Sponsor a child" :image="image" :reference="reference">
    <template #title>
      Sponsor a child <NHeadingHighlight tone="coral">back to school</NHeadingHighlight>
    </template>
    <template #lead>
      The sponsor's application form. Pay a child's school fees, and give them the chance to learn,
      grow and choose their own future.
    </template>
    <template #done>
      We've received your sponsor's application, and the Bellvicks team will be in touch about the
      next steps. {{ SPONSOR_APPRECIATION }}
    </template>

    <form class="grid gap-6" novalidate @submit.prevent="onSubmit">
      <!-- 1. Sponsor -->
      <bs-form-section :step="1" title="About you">
        <NChoiceGroup
          v-model="sponsorKind"
          legend="Are you sponsoring as an organisation or as an individual?"
          name="sponsorKind"
          :options="SPONSOR_KINDS"
          :error="errors.sponsorKind"
        />
        <div class="grid gap-5 sm:grid-cols-2">
          <NField v-slot="f" label="Name" :error="errors.name">
            <NInput
              :id="f.id"
              v-model="name"
              v-bind="nameAttrs"
              autocomplete="name"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField
            v-if="sponsorKind === 'organisation'"
            v-slot="f"
            label="Organisation"
            :error="errors.organisation"
          >
            <NInput
              :id="f.id"
              v-model="organisation"
              v-bind="organisationAttrs"
              autocomplete="organization"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField v-slot="f" label="Nationality" :error="errors.nationality">
            <NInput
              :id="f.id"
              v-model="nationality"
              v-bind="nationalityAttrs"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField v-slot="f" label="State of origin" optional :error="errors.stateOfOrigin">
            <NInput
              :id="f.id"
              v-model="stateOfOrigin"
              v-bind="stateOfOriginAttrs"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField v-slot="f" label="Local Govt. Area" optional :error="errors.lga">
            <NInput
              :id="f.id"
              v-model="lga"
              v-bind="lgaAttrs"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField v-slot="f" label="Occupation" :error="errors.occupation">
            <NInput
              :id="f.id"
              v-model="occupation"
              v-bind="occupationAttrs"
              autocomplete="organization-title"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
        </div>
        <NField v-slot="f" label="Office address" optional :error="errors.officeAddress">
          <NInput
            :id="f.id"
            v-model="officeAddress"
            v-bind="officeAddressAttrs"
            autocomplete="street-address"
            :aria-describedby="f.describedby"
            :invalid="f.invalid"
          />
        </NField>
        <div class="grid gap-5 sm:grid-cols-2">
          <NField v-slot="f" label="Phone number" :error="errors.phone">
            <NInput
              :id="f.id"
              v-model="phone"
              v-bind="phoneAttrs"
              type="tel"
              autocomplete="tel"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
          <NField v-slot="f" label="Second phone number" optional :error="errors.phone2">
            <NInput
              :id="f.id"
              v-model="phone2"
              v-bind="phone2Attrs"
              type="tel"
              :aria-describedby="f.describedby"
              :invalid="f.invalid"
            />
          </NField>
        </div>
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
        <bs-form-photo-field
          v-model="passport"
          label="Recent passport photograph"
          icon="user"
          hint="Optional. A clear, recent photo of your face."
        />
      </bs-form-section>

      <!-- 2. Commitment -->
      <bs-form-section :step="2" title="Your commitment">
        <div class="flex items-center gap-4 rounded-2xl bg-sun-50 p-5 ring-1 ring-sun-150">
          <NIconBlob icon="education" tone="sun" class="size-14" />
          <p class="text-base-600">
            BGAI standard rate of school fee per term:
            <strong class="font-display block text-2xl text-forest-900">{{
              formatMoney(SCHOOL_FEE_PER_TERM_NGN)
            }}</strong>
          </p>
        </div>
        <NField v-slot="f" label="Number of children" :error="errors.numberOfChildren">
          <NInput
            :id="f.id"
            :model-value="numberOfChildren == null ? '' : String(numberOfChildren)"
            type="number"
            min="1"
            inputmode="numeric"
            class="max-w-40"
            :aria-describedby="f.describedby"
            :invalid="f.invalid"
            @update:model-value="numberOfChildren = $event === '' ? undefined : Number($event)"
          />
        </NField>
        <NChoiceGroup
          v-model="years"
          legend="Number of years"
          name="years"
          :options="SPONSOR_YEARS"
          :error="errors.years"
        />
        <NChoiceGroup
          v-model="paymentModel"
          legend="Payment model"
          name="paymentModel"
          :options="PAYMENT_MODELS"
          :error="errors.paymentModel"
        />
      </bs-form-section>

      <!-- 3. Further commitment -->
      <bs-form-section
        :step="3"
        title="Further commitment (yearly)"
        hint="The child's school items. Tick as appropriate: these are optional, per child, per year."
      >
        <fieldset>
          <legend class="sr-only">Child's school items</legend>
          <ul role="list" class="grid gap-2">
            <li v-for="item in SCHOOL_ITEMS" :key="item.id">
              <label
                class="flex cursor-pointer items-center gap-4 rounded-2xl border border-base-150 p-4 transition-colors hover:border-forest-150 has-[:checked]:border-forest-500 has-[:checked]:bg-forest-50"
              >
                <input
                  v-model="schoolItems"
                  type="checkbox"
                  :value="item.id"
                  class="size-5 shrink-0 cursor-pointer accent-forest-500"
                />
                <span class="flex-1">
                  <span class="block font-bold text-base-900">{{ item.label }}</span>
                  <span v-if="item.quantity" class="block text-sm text-base-550">
                    Quantity: {{ item.quantity }}
                  </span>
                </span>
                <span class="font-bold text-forest-900">{{ formatMoney(item.cost) }}</span>
              </label>
            </li>
          </ul>
        </fieldset>
        <p
          v-if="schoolItems?.length"
          class="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-forest-900 p-5 text-base-0"
          aria-live="polite"
        >
          <span>
            School items per child, per year
            <span v-if="childCount > 1" class="block text-sm text-base-0/75"
              >× {{ childCount }} children = {{ formatMoney(itemsPerChild * childCount) }} a
              year</span
            >
          </span>
          <strong class="font-display text-2xl">{{ formatMoney(itemsPerChild) }}</strong>
        </p>
      </bs-form-section>

      <!-- 4. Declaration and signature -->
      <bs-form-section :step="4" title="Declaration">
        <bs-form-sign
          v-model:agreed="declaration"
          v-model:signature="signature"
          :statement="[sponsorDeclaration(name ?? '')]"
          agree-label="I understand and agree to this declaration."
          :agree-error="errors.declaration"
          :signature-error="errors.signature"
        />
      </bs-form-section>

      <div class="grid gap-3">
        <NButton type="submit" size="lg" :disabled="isSubmitting || isPending" class="w-full">
          <NIcon
            :name="isSubmitting || isPending ? 'spinner' : 'heart'"
            weight="fill"
            :class="(isSubmitting || isPending) && 'animate-spin'"
          />
          {{ isSubmitting || isPending ? "Sending…" : "Send my sponsor's application" }}
        </NButton>
        <p class="text-center text-xs text-base-550">
          No payment is taken on this page. For account information, please visit our
          <NuxtLink :to="ROUTES.donate" class="underline underline-offset-2">Donate page</NuxtLink>.
          See our
          <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2"
            >privacy policy</NuxtLink
          >.
        </p>
      </div>
    </form>

    <p class="mt-8 rounded-2xl bg-base-0 p-5 text-center text-base-600 shadow-soft">
      {{ SPONSOR_APPRECIATION }}
      <span class="mt-2 block text-sm"
        >For supervision of community back to school project/sponsorship in your constituency,
        please
        <NuxtLink
          :to="ROUTES.contact"
          class="font-bold text-forest-900 underline underline-offset-2"
          >contact us</NuxtLink
        >.</span
      >
    </p>
  </bs-form-shell>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { photo } from "~/shared/photos";
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import {
  PAYMENT_MODELS,
  SCHOOL_FEE_PER_TERM_NGN,
  SCHOOL_ITEMS,
  SPONSOR_APPRECIATION,
  SPONSOR_KINDS,
  SPONSOR_YEARS,
  schoolItemsCost,
  sponsorDeclaration,
  sponsorSchema,
} from "../../domain/sponsorship-forms";

const image = photo(
  "/images/back-to-school/sponsor.jpg",
  "boysInUniform",
  "Pupils in school uniform",
);
const { submit, isPending } = useSponsorship("sponsor");

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(sponsorSchema),
  initialValues: { sponsorKind: "individual", schoolItems: [], declaration: false },
});
const [sponsorKind] = defineField("sponsorKind");
const [name, nameAttrs] = defineField("name");
const [organisation, organisationAttrs] = defineField("organisation");
const [nationality, nationalityAttrs] = defineField("nationality");
const [stateOfOrigin, stateOfOriginAttrs] = defineField("stateOfOrigin");
const [lga, lgaAttrs] = defineField("lga");
const [occupation, occupationAttrs] = defineField("occupation");
const [officeAddress, officeAddressAttrs] = defineField("officeAddress");
const [phone, phoneAttrs] = defineField("phone");
const [phone2, phone2Attrs] = defineField("phone2");
const [email, emailAttrs] = defineField("email");
const [numberOfChildren] = defineField("numberOfChildren");
const [years] = defineField("years");
const [paymentModel] = defineField("paymentModel");
const [schoolItems] = defineField("schoolItems");
const [declaration] = defineField("declaration");
const [signature] = defineField("signature");

const passport = ref<File | null>(null);
const reference = ref("");

const itemsPerChild = computed(() => schoolItemsCost(schoolItems.value ?? []));
const childCount = computed(() => Math.max(1, Number(numberOfChildren.value) || 1));

const onSubmit = handleSubmit(
  async (values) => {
    try {
      reference.value = await submit(
        values,
        passport.value ? { sponsorPassport: passport.value } : {},
      );
    } catch (error) {
      push.error({
        title: "Couldn't send your application",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  },
  () => {
    // Take the visitor to the first problem.
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  },
);
</script>
