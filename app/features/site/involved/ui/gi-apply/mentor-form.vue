<template>
  <form class="grid gap-5" novalidate @submit.prevent="onSubmit">
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
      <NField v-slot="f" label="What do you do?" :error="errors.occupation">
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
    <NField v-slot="f" label="Why would you like to mentor?" :error="errors.motivation">
      <NTextarea
        :id="f.id"
        v-model="motivation"
        v-bind="motivationAttrs"
        :rows="5"
        :aria-describedby="f.describedby"
        :invalid="f.invalid"
      />
    </NField>
    <p class="text-sm text-base-550">
      Mentors work with children, so we'll talk with you about safeguarding before you start.
    </p>
    <gi-apply-submit :pending="isSubmitting || isPending" label="Apply to mentor" />
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { mentorSchema } from "../../domain/involved-forms";

const emit = defineEmits<{ sent: [] }>();
const { submit, isPending } = useInvolved("mentor");

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(mentorSchema),
});
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [phone, phoneAttrs] = defineField("phone");
const [occupation, occupationAttrs] = defineField("occupation");
const [motivation, motivationAttrs] = defineField("motivation");

const onSubmit = handleSubmit(async (values) => {
  try {
    await submit(values);
    resetForm();
    emit("sent");
  } catch (error) {
    push.error({
      title: "Couldn't send your application",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
