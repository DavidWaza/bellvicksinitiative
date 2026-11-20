<template>
  <div>
    <NPageHero eyebrow="Contact" :breadcrumbs="[{ label: 'Contact' }]">
      We'd love to <NHeadingHighlight>hear from you</NHeadingHighlight>
      <template #lead>
        Questions about our work, giving, volunteering or partnerships? Get in touch with the
        Bellvicks team in Abuja.
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="Contact details and form">
      <NContainer class="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div class="grid content-start gap-4">
          <NCard class="flex-row items-start gap-4 p-5">
            <NIconBlob icon="pin" tone="coral" class="size-12" />
            <div>
              <h2 class="font-display text-lg font-semibold text-forest-900">Visit us</h2>
              <address class="mt-1 text-base-600 not-italic">
                {{ SITE_INFO.address.street }}<br />{{ SITE_INFO.address.locality }},
                {{ SITE_INFO.address.country }}
              </address>
              <NLink
                :to="mapsHref"
                class="mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-forest-500 underline underline-offset-4"
              >
                Open in Google Maps <NIcon name="external" />
              </NLink>
            </div>
          </NCard>
          <NCard class="flex-row items-start gap-4 p-5">
            <NIconBlob icon="phone" tone="sky" class="size-12" />
            <div>
              <h2 class="font-display text-lg font-semibold text-forest-900">Call us</h2>
              <ul role="list">
                <li v-for="phone in SITE_INFO.phones" :key="phone.href">
                  <NLink
                    :to="phone.href"
                    class="inline-flex min-h-11 items-center font-medium text-base-900 hover:text-forest-500"
                  >
                    {{ phone.display }}
                  </NLink>
                </li>
              </ul>
            </div>
          </NCard>
          <NCard class="flex-row items-start gap-4 p-5">
            <NIconBlob icon="mail" tone="sun" class="size-12" />
            <div class="min-w-0">
              <h2 class="font-display text-lg font-semibold text-forest-900">Email us</h2>
              <NLink
                :to="`mailto:${SITE_INFO.email}`"
                class="inline-flex min-h-11 items-center font-medium break-all text-base-900 hover:text-forest-500"
              >
                {{ SITE_INFO.email }}
              </NLink>
            </div>
          </NCard>
          <NCard class="flex-row items-start gap-4 p-5">
            <NIconBlob icon="heart" tone="lavender" class="size-12" />
            <div>
              <h2 class="font-display text-lg font-semibold text-forest-900">Follow us</h2>
              <ul role="list" class="mt-1 flex gap-2">
                <li v-for="social in SITE_INFO.socials" :key="social.id">
                  <NLink
                    :to="social.href"
                    :aria-label="`${SITE_INFO.name} on ${social.label}`"
                    class="flex size-11 items-center justify-center rounded-full bg-forest-50 text-forest-500 hover:bg-forest-500 hover:text-base-0"
                  >
                    <NIcon :name="social.id" size="1.35rem" />
                  </NLink>
                </li>
              </ul>
            </div>
          </NCard>
        </div>

        <NCard class="p-6 sm:p-8">
          <div v-if="sent" role="status" class="flex flex-col items-center py-10 text-center">
            <NIconBlob icon="send" tone="mint" class="size-20" />
            <h2 class="font-display mt-5 text-2xl font-semibold text-forest-900">Message sent</h2>
            <p class="mt-2 max-w-sm text-base-550">
              Thank you for getting in touch. We'll reply as soon as we can.
            </p>
            <NButton class="mt-6" variant="ghost" color="brand" @click="sent = false"
              >Send another message</NButton
            >
          </div>
          <form v-else class="grid gap-5" novalidate @submit.prevent="onSubmit">
            <h2 class="font-display text-2xl font-semibold text-forest-900">Send us a message</h2>
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
            <NField v-slot="f" label="Topic" :error="errors.topic">
              <NSelect
                :id="f.id"
                v-model="topic"
                :options="CONTACT_TOPICS"
                placeholder="Choose a topic"
                :aria-describedby="f.describedby"
                :invalid="f.invalid"
              />
            </NField>
            <NField v-slot="f" label="Message" :error="errors.message">
              <NTextarea
                :id="f.id"
                v-model="message"
                v-bind="messageAttrs"
                :rows="6"
                :aria-describedby="f.describedby"
                :invalid="f.invalid"
              />
            </NField>
            <NButton type="submit" size="lg" :disabled="isSubmitting || isPending" class="w-full">
              <NIcon
                :name="isSubmitting || isPending ? 'spinner' : 'send'"
                :class="(isSubmitting || isPending) && 'animate-spin'"
              />
              {{ isSubmitting || isPending ? "Sending…" : "Send message" }}
            </NButton>
            <p class="text-center text-xs text-base-550">
              We only use your details to reply. See our
              <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2"
                >privacy policy</NuxtLink
              >.
            </p>
          </form>
        </NCard>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";
import { CONTACT_TOPICS, contactSchema } from "../../domain/contact-types";

const { send, isPending } = useContact();
const sent = ref(false);

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE_INFO.address.street}, ${SITE_INFO.address.locality}, ${SITE_INFO.address.country}`,
)}`;

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: { topic: "" },
});
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [topic] = defineField("topic");
const [message, messageAttrs] = defineField("message");

const onSubmit = handleSubmit(async (values) => {
  try {
    await send(values);
    resetForm();
    sent.value = true;
  } catch (error) {
    push.error({
      title: "Couldn't send your message",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
});
</script>
