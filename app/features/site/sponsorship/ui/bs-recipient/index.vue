<template>
  <bs-form-shell crumb="Apply for sponsorship" :image="image" :reference="reference">
    <template #title>
      Recipient <NHeadingHighlight tone="coral">information</NHeadingHighlight>
    </template>
    <template #lead>
      The recipient application form. Parents and guardians can apply for help with a child's school
      fees. Please fill in every part, with the school's and a witness's confirmation.
    </template>
    <template #done>
      We've received the application for {{ childName }}. The Bellvicks team will review it and
      contact you. {{ RECIPIENT_NOTE }}
    </template>

    <div
      class="mb-6 flex items-start gap-3 rounded-2xl bg-coral-50 p-5 text-sm text-base-900 ring-1 ring-coral-150"
    >
      <NIcon name="warning" weight="duotone" size="1.4rem" class="shrink-0 text-coral-700" />
      <p><strong>Note:</strong> {{ RECIPIENT_NOTE }}</p>
    </div>

    <form class="grid gap-6" novalidate @submit.prevent="onSubmit">
      <!-- 1. School information -->
      <bs-form-section :step="1" title="School information">
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="schoolName" label="Name of school" />
          <bs-form-text name="principalName" label="Name of principal" />
          <bs-form-text name="schoolPhone" label="School phone number" type="tel" inputmode="tel" />
          <bs-form-text
            name="schoolPhone2"
            label="Second phone number"
            optional
            type="tel"
            inputmode="tel"
          />
        </div>
        <bs-form-text name="schoolAddress" label="School address" />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="schoolState" label="State" />
          <bs-form-text name="schoolEmail" label="School email" optional type="email" />
        </div>
        <NChoiceGroup
          v-model="schoolType"
          legend="Type of school"
          name="schoolType"
          :options="SCHOOL_TYPES"
          :error="errors.schoolType"
        />
        <div class="mt-2 border-t border-base-150 pt-6">
          <h3 class="font-display text-lg font-semibold text-forest-900">
            Confirmation by the school
          </h3>
          <p class="mt-1 mb-4 text-sm text-base-550">
            To be confirmed by the principal or a school official.
          </p>
          <bs-form-sign
            v-model:agreed="schoolConfirm"
            v-model:signature="schoolConfirmName"
            :statement="[schoolConfirmation(schoolConfirmName ?? '')]"
            agree-label="I confirm this on behalf of the school."
            signature-label="Name of the principal or school official (signature)"
            :agree-error="errors.schoolConfirm"
            :signature-error="errors.schoolConfirmName"
          />
        </div>
      </bs-form-section>

      <!-- 2. Child's information -->
      <bs-form-section :step="2" title="Child's information">
        <bs-form-text name="childName" label="Name of child" />
        <NChoiceGroup
          v-model="childGender"
          legend="Gender"
          name="childGender"
          :options="GENDERS"
          :error="errors.childGender"
        />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="childAge" label="Age" type="number" inputmode="numeric" />
          <bs-form-text name="classGrade" label="Class / grade" />
          <bs-form-text name="childStateOfOrigin" label="State of origin" />
          <bs-form-text name="childLga" label="Local Gov't Area" />
          <bs-form-text name="stateOfResidence" label="State of residence" />
          <bs-form-text
            name="childPhone"
            label="Phone no. (if any)"
            optional
            type="tel"
            inputmode="tel"
          />
        </div>
        <bs-form-text name="hobbies" label="Hobbies" optional />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-photo-field
            v-model="files.childPassport"
            label="Child's recent passport photograph"
            required
            icon="user"
            :error="fileErrors.childPassport"
          />
          <bs-form-photo-field
            v-model="files.birthCertificate"
            label="Birth certificate (photocopy)"
            icon="idCard"
            hint="A clear photo of the birth certificate."
          />
          <bs-form-photo-field
            v-model="files.results"
            label="Educational profile (photocopy of result)"
            icon="news"
            hint="A clear photo of the child's latest result."
          />
        </div>
      </bs-form-section>

      <!-- 3. Parents / guardian's information -->
      <bs-form-section :step="3" title="Parents / guardian's information">
        <bs-form-text name="parentName" label="Name" autocomplete="name" />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="parentStateOfOrigin" label="State of origin" />
          <bs-form-text name="parentLga" label="Local Govt. Area" />
        </div>
        <bs-form-text name="permanentAddress" label="Permanent home address" />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text
            name="parentPhone"
            label="Phone number"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
          />
          <bs-form-text
            name="parentPhone2"
            label="Second phone number"
            optional
            type="tel"
            inputmode="tel"
          />
        </div>
        <bs-form-text
          name="parentEmail"
          label="Email"
          optional
          type="email"
          autocomplete="email"
          hint="So we can reply by email. We'll call you if you leave it blank."
        />
        <bs-form-text name="residentialAddress" label="Residential address" />
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="parentOccupation" label="Occupation" />
          <bs-form-text name="parentOfficeAddress" label="Office address" optional />
        </div>
        <NChoiceGroup
          v-model="relationship"
          legend="Relationship with child"
          name="relationship"
          :options="RELATIONSHIPS"
          :error="errors.relationship"
        />
        <bs-form-text
          v-if="relationship === 'other'"
          name="relationshipOther"
          label="Others (please specify)"
        />
        <bs-form-photo-field
          v-model="files.parentPassport"
          label="Parent / guardian's recent passport photograph"
          required
          icon="user"
          :error="fileErrors.parentPassport"
        />
      </bs-form-section>

      <!-- 4. Disclaimer -->
      <bs-form-section :step="4" title="Disclaimer">
        <bs-form-sign
          v-model:agreed="disclaimer"
          v-model:signature="parentSignature"
          :statement="DISCLAIMER"
          agree-label="As the parent / guardian, I accept this disclaimer and confirm all the information provided is true."
          signature-label="Signature of parent / guardian"
          :agree-error="errors.disclaimer"
          :signature-error="errors.parentSignature"
        />
      </bs-form-section>

      <!-- 5. Witness / next of kin -->
      <bs-form-section :step="5" title="Witness / next of kin">
        <div class="grid gap-5 sm:grid-cols-2">
          <bs-form-text name="witnessName" label="Name" />
          <bs-form-text name="witnessPhone" label="Phone no." type="tel" inputmode="tel" />
        </div>
        <bs-form-text name="witnessAddress" label="Address" />
        <bs-form-text name="witnessRelationship" label="Relationship with parents / guardian" />
        <bs-form-sign
          v-model:agreed="witnessConfirm"
          v-model:signature="witnessSignature"
          :statement="[witnessConfirmation(witnessName ?? '')]"
          agree-label="As the witness / next of kin, I confirm this."
          signature-label="Witness's signature"
          :agree-error="errors.witnessConfirm"
          :signature-error="errors.witnessSignature"
        />
      </bs-form-section>

      <div class="grid gap-3">
        <NButton type="submit" size="lg" :disabled="isSubmitting || isPending" class="w-full">
          <NIcon v-if="isSubmitting || isPending" name="spinner" class="animate-spin" />
          {{ isSubmitting || isPending ? "Sending…" : "Send the application" }}
        </NButton>
        <p class="text-center text-xs text-base-550">
          This form is free. Your details and photos go only to the Bellvicks team. See our
          <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2"
            >privacy policy</NuxtLink
          >.
        </p>
      </div>
    </form>
  </bs-form-shell>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { photo } from "~/shared/photos";
import { ROUTES } from "~/shared/site-routes";
import {
  DISCLAIMER,
  GENDERS,
  RECIPIENT_NOTE,
  RECIPIENT_UPLOADS,
  RELATIONSHIPS,
  SCHOOL_TYPES,
  recipientSchema,
  schoolConfirmation,
  witnessConfirmation,
  type RecipientUploadId,
} from "../../domain/sponsorship-forms";

const image = photo("/images/back-to-school/apply.jpg", "pupilsWriting", "Pupils writing in class");
const { submit, isPending } = useSponsorship("recipient");

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(recipientSchema),
  initialValues: { schoolConfirm: false, disclaimer: false, witnessConfirm: false },
});
const [schoolType] = defineField("schoolType");
const [schoolConfirm] = defineField("schoolConfirm");
const [schoolConfirmName] = defineField("schoolConfirmName");
const [childName] = defineField("childName");
const [childGender] = defineField("childGender");
const [relationship] = defineField("relationship");
const [disclaimer] = defineField("disclaimer");
const [parentSignature] = defineField("parentSignature");
const [witnessName] = defineField("witnessName");
const [witnessConfirm] = defineField("witnessConfirm");
const [witnessSignature] = defineField("witnessSignature");

// Photos live outside vee-validate (Files); the required ones are checked on submit.
const files = reactive<Record<RecipientUploadId, File | null>>({
  childPassport: null,
  birthCertificate: null,
  results: null,
  parentPassport: null,
});
const fileErrors = reactive<Partial<Record<RecipientUploadId, string>>>({});
const reference = ref("");

function checkFiles(): boolean {
  for (const u of RECIPIENT_UPLOADS) {
    fileErrors[u.id] =
      u.required && !files[u.id] ? `Please add the ${u.label.toLowerCase()}.` : undefined;
  }
  return RECIPIENT_UPLOADS.every((u) => !fileErrors[u.id]);
}
watch(files, () => Object.values(fileErrors).some(Boolean) && checkFiles());

const focusFirstProblem = () =>
  nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

const onSubmit = handleSubmit(
  async (values) => {
    if (!checkFiles()) return focusFirstProblem();
    const upload = Object.fromEntries(
      Object.entries(files).filter((e): e is [string, File] => e[1] !== null),
    );
    try {
      reference.value = await submit(values, upload);
    } catch (error) {
      push.error({
        title: "Couldn't send the application",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  },
  () => {
    checkFiles();
    focusFirstProblem();
  },
);
</script>
