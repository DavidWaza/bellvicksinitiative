<template>
  <form class="grid gap-5" novalidate @submit.prevent="onSubmit">
    <NChoiceGroup
      v-model="role"
      legend="How would you like to volunteer?"
      name="role"
      :options="VOLUNTEER_ROLES"
      :error="errors.role"
    />
    <div class="grid gap-5 sm:grid-cols-2">
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
      <NField v-slot="f" label="Where are you based?" optional :error="errors.location">
        <NInput
          :id="f.id"
          v-model="location"
          v-bind="locationAttrs"
          autocomplete="address-level2"
          :aria-describedby="f.describedby"
          :invalid="f.invalid"
        />
      </NField>
    </div>
    <NChoiceGroup
      v-model="availability"
      legend="When are you available?"
      name="availability"
      :options="AVAILABILITY_OPTIONS"
      :error="errors.availability"
    />
    <NField v-slot="f" label="Skills or interests" optional :error="errors.skills">
      <NTextarea
        :id="f.id"
        v-model="skills"
        v-bind="skillsAttrs"
        :rows="4"
        :aria-describedby="f.describedby"
        :invalid="f.invalid"
      />
    </NField>
    <label
      class="flex cursor-pointer items-center gap-3 rounded-2xl border border-base-150 bg-base-50 p-4 transition-colors hover:border-forest-150 has-[:checked]:border-forest-500 has-[:checked]:bg-forest-50"
    >
      <input
        v-model="newsletter"
        type="checkbox"
        class="size-5 shrink-0 cursor-pointer accent-forest-500"
      />
      <span class="text-sm font-bold text-base-900">Subscribe to our newsletter</span>
    </label>
    <gi-apply-submit :pending="isSubmitting || isPending" label="Join the volunteer network" />
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import {
  AVAILABILITY_OPTIONS,
  VOLUNTEER_ROLES,
  volunteerSchema,
} from "../../domain/involved-forms";

const emit = defineEmits<{ sent: [] }>();
const { submit, isPending } = useInvolved("volunteer");

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(volunteerSchema),
  initialValues: { availability: "flexible", newsletter: false },
});
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [phone, phoneAttrs] = defineField("phone");
const [location, locationAttrs] = defineField("location");
const [role] = defineField("role");
const [availability] = defineField("availability");
const [skills, skillsAttrs] = defineField("skills");
const [newsletter] = defineField("newsletter");

const onSubmit = handleSubmit(async (values) => {
  try {
    await submit(values);
    resetForm();
    emit("sent");
  } catch (error) {
    push.error({
      title: "Couldn't send your details",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
