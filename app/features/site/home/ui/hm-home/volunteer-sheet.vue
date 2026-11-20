<template>
  <NSheet v-model:open="open">
    <NSheetTrigger>
      <slot name="trigger" />
    </NSheetTrigger>
    <NSheetContent>
      <form class="flex flex-col gap-5 p-6 pt-5" novalidate @submit.prevent="onSubmit">
        <div class="pr-12">
          <NSheetTitle>Join the volunteer network</NSheetTitle>
          <NSheetDescription class="mt-2">
            Tell us a little about yourself and the Bellvicks team will be in touch.
          </NSheetDescription>
        </div>

        <NField v-slot="{ id, describedby, invalid }" label="Full name" :error="errors.name">
          <NInput
            :id="id"
            v-model="name"
            v-bind="nameAttrs"
            autocomplete="name"
            :aria-describedby="describedby"
            :invalid="invalid"
          />
        </NField>

        <NField v-slot="{ id, describedby, invalid }" label="Email" :error="errors.email">
          <NInput
            :id="id"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            inputmode="email"
            autocomplete="email"
            :aria-describedby="describedby"
            :invalid="invalid"
          />
        </NField>

        <NField v-slot="{ id, describedby, invalid }" label="Phone" optional :error="errors.phone">
          <NInput
            :id="id"
            v-model="phone"
            v-bind="phoneAttrs"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            :aria-describedby="describedby"
            :invalid="invalid"
          />
        </NField>

        <fieldset class="flex flex-col gap-2">
          <legend class="mb-1.5 text-sm font-bold text-base-900">I'm interested in</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="option in VOLUNTEER_INTERESTS" :key="option" class="relative">
              <input
                v-model="interest"
                v-bind="interestAttrs"
                type="radio"
                name="interest"
                :value="option"
                class="peer sr-only"
              />
              <span
                class="flex min-h-11 cursor-pointer items-center rounded-full border border-base-150 bg-base-0 px-4 text-sm font-bold text-base-900 transition-colors peer-checked:border-forest-500 peer-checked:bg-forest-500 peer-checked:text-base-0 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)]"
              >
                {{ option }}
              </span>
            </label>
          </div>
        </fieldset>

        <NButton type="submit" size="lg" :disabled="isSubmitting || isPending" class="mt-2 w-full">
          <NIcon v-if="isSubmitting || isPending" name="spinner" class="animate-spin" />
          {{ isSubmitting || isPending ? "Sending…" : "Send my details" }}
        </NButton>
        <p class="text-center text-xs text-base-550">
          We only use your details to get in touch about volunteering.
        </p>
      </form>
    </NSheetContent>
  </NSheet>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { VOLUNTEER_INTERESTS } from "../../domain/home-types";

const open = ref(false);
const { submit, isPending } = useVolunteerInterest();

const schema = toTypedSchema(
  yup.object({
    name: yup.string().trim().required("Please tell us your name."),
    email: yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Please enter your email."),
    phone: yup
      .string()
      .trim()
      .default("")
      .matches(/^[+()\d\s-]{7,20}$/, {
        excludeEmptyString: true,
        message: "Enter a valid phone number.",
      }),
    interest: yup.string().oneOf(VOLUNTEER_INTERESTS).required("Choose one."),
  }),
);

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: { interest: "Volunteer", phone: "" },
});

const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [phone, phoneAttrs] = defineField("phone");
const [interest, interestAttrs] = defineField("interest");

const onSubmit = handleSubmit(async (values) => {
  try {
    await submit(values);
    push.success({
      title: "Thank you!",
      message: "We've received your details and will be in touch soon.",
    });
    resetForm();
    open.value = false;
  } catch (error) {
    push.error({
      title: "Couldn't send your details",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
