<template>
  <form class="grid gap-5" novalidate @submit.prevent="onSubmit">
    <NChoiceGroup
      v-model="partnerKind"
      legend="Who is partnering with us?"
      name="partnerKind"
      :options="PARTNER_KINDS"
      :error="errors.partnerKind"
    />

    <!-- Individuals: title + name -->
    <div v-if="isIndividual" class="grid gap-5 sm:grid-cols-[9rem_1fr]">
      <NField v-slot="f" label="Title" :error="errors.title">
        <NSelect
          :id="f.id"
          v-model="title"
          :options="PERSON_TITLES"
          placeholder="Choose"
          autocomplete="honorific-prefix"
          :aria-describedby="f.describedby"
          :invalid="f.invalid"
        />
      </NField>
      <NField v-slot="f" label="Full name" :error="errors.name">
        <NInput
          :id="f.id"
          v-model="name"
          v-bind="nameAttrs"
          autocomplete="name"
          :aria-describedby="f.describedby"
          :invalid="f.invalid"
        />
      </NField>
    </div>

    <!-- Organisations and agencies: their name, then the contact person -->
    <template v-else>
      <NField v-slot="f" :label="`${kindLabel} name`" :error="errors.organisation">
        <NInput
          :id="f.id"
          v-model="organisation"
          v-bind="organisationAttrs"
          autocomplete="organization"
          :aria-describedby="f.describedby"
          :invalid="f.invalid"
        />
      </NField>
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
        <NField v-slot="f" label="Your role" optional :error="errors.jobTitle">
          <NInput
            :id="f.id"
            v-model="jobTitle"
            v-bind="jobTitleAttrs"
            autocomplete="organization-title"
            placeholder="e.g. Programme Director"
            :aria-describedby="f.describedby"
            :invalid="f.invalid"
          />
        </NField>
      </div>
    </template>

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
    <NField v-slot="f" label="Phone" optional :error="errors.phone">
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
    <NField v-slot="f" label="Type of partnership" :error="errors.partnershipType">
      <NSelect
        :id="f.id"
        v-model="partnershipType"
        :options="PARTNERSHIP_TYPES"
        placeholder="Choose one"
        :aria-describedby="f.describedby"
        :invalid="f.invalid"
      />
    </NField>
    <NField v-slot="f" label="Tell us more" optional :error="errors.message">
      <NTextarea
        :id="f.id"
        v-model="message"
        v-bind="messageAttrs"
        :rows="4"
        :aria-describedby="f.describedby"
        :invalid="f.invalid"
      />
    </NField>
    <gi-apply-submit :pending="isSubmitting || isPending" label="Send enquiry" />
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import {
  PARTNER_KINDS,
  PARTNERSHIP_TYPES,
  PERSON_TITLES,
  partnerSchema,
} from "../../domain/involved-forms";

const emit = defineEmits<{ sent: [] }>();
const { submit, isPending } = useInvolved("partner");

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(partnerSchema),
  initialValues: { partnerKind: "organisation", title: "", partnershipType: "" },
});
const [partnerKind] = defineField("partnerKind");
const [title] = defineField("title");
const [organisation, organisationAttrs] = defineField("organisation");
const [jobTitle, jobTitleAttrs] = defineField("jobTitle");
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [phone, phoneAttrs] = defineField("phone");
const [partnershipType] = defineField("partnershipType");
const [message, messageAttrs] = defineField("message");

const isIndividual = computed(() => partnerKind.value === "individual");
const kindLabel = computed(
  () => PARTNER_KINDS.find((k) => k.value === partnerKind.value)?.label ?? "Organisation",
);

const onSubmit = handleSubmit(async (values) => {
  try {
    await submit(values);
    resetForm();
    emit("sent");
  } catch (error) {
    push.error({
      title: "Couldn't send your enquiry",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
