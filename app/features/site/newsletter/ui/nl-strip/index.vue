<template>
  <NSection
    tone="white"
    spacing="none"
    id="newsletter"
    aria-label="Newsletter"
    class="scroll-mt-20 border-y border-base-150/70 py-6"
  >
    <NContainer
      class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
    >
      <div class="flex items-center gap-4">
        <NIconBlob icon="mail" tone="accent" shape="blob-3" class="size-14" />
        <div>
          <h2 class="font-display text-xl font-semibold text-forest-900">Stay updated</h2>
          <p class="text-sm text-base-550">
            Stories, progress and ways to help, straight to your inbox.
          </p>
        </div>
      </div>

      <div class="w-full lg:max-w-xl">
        <form class="flex flex-col gap-3 sm:flex-row" novalidate @submit.prevent="onSubmit">
          <label :for="inputId" class="sr-only">Email address</label>
          <NInput
            :id="inputId"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="Enter your email address"
            :invalid="Boolean(errors.email)"
            :aria-describedby="statusId"
            class="sm:flex-1"
          />
          <NButton type="submit" color="brand" :disabled="isSubmitting || isPending">
            <NIcon v-if="isSubmitting || isPending" name="spinner" class="animate-spin" />
            Subscribe
          </NButton>
        </form>
        <p
          :id="statusId"
          role="status"
          aria-live="polite"
          :class="
            cn(
              'mt-2 min-h-6 text-sm font-medium',
              feedback?.type === 'error' || errors.email ? 'text-red-600' : 'text-green-600',
            )
          "
        >
          {{ errors.email ?? feedback?.text }}
        </p>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { newsletterSchema } from "../../domain/newsletter-types";

// Static ids, not useId(): this section hydrates lazily, and a lazily hydrated useId() differs
// from the server's, which broke the label → input association. One newsletter form per page.
const inputId = "newsletter-email";
const statusId = "newsletter-status";
const { subscribe, isPending } = useNewsletter();

const feedback = ref<{ type: "success" | "error"; text: string } | null>(null);

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(newsletterSchema),
});
const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  feedback.value = null;
  try {
    await subscribe(values);
    feedback.value = { type: "success", text: "Thank you — you're subscribed." };
    resetForm();
  } catch (error) {
    feedback.value = {
      type: "error",
      text: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }
});
</script>
