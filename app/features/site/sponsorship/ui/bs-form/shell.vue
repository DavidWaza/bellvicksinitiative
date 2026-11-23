<template>
  <div>
    <NPageHero
      eyebrow="Back to School"
      eyebrow-tone="coral"
      :breadcrumbs="[{ label: 'Back to School', to: ROUTES.backToSchool }, { label: crumb }]"
    >
      <slot name="title" />
      <template #lead><slot name="lead" /></template>
      <template #media>
        <NBlobImage
          :image="image"
          mask="blob-2"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.15] w-full"
        />
      </template>
    </NPageHero>

    <NSection tone="cream" :aria-label="crumb">
      <NContainer size="narrow">
        <!-- Sent -->
        <div
          v-if="reference"
          ref="doneEl"
          role="status"
          tabindex="-1"
          class="flex flex-col items-center rounded-3xl bg-base-0 p-8 text-center shadow-soft sm:p-12"
        >
          <NIconBlob icon="check" tone="mint" class="size-20" />
          <h2 class="font-display mt-6 text-3xl font-semibold text-forest-900">Thank you!</h2>
          <p class="mt-3 max-w-md text-base-600"><slot name="done" /></p>
          <p class="mt-5 rounded-full bg-forest-50 px-5 py-2 text-sm text-forest-900">
            Application no. <strong class="font-bold">{{ reference }}</strong>
          </p>
          <p class="mt-3 text-sm text-base-550">Keep this number for when we contact you.</p>
          <NButton :to="ROUTES.backToSchool" variant="ghost" color="brand" class="mt-8"
            >Back to School home</NButton
          >
        </div>

        <!-- The form -->
        <template v-else>
          <p class="mb-6 rounded-2xl bg-sky-50 p-4 text-sm text-base-600">
            <NIcon name="info" weight="duotone" class="mr-1 inline text-sky-700" />
            Fields marked optional can be left blank. Your answers go straight to the Bellvicks
            team.
          </p>
          <slot />
        </template>

        <p class="font-display mt-12 text-center text-xl leading-relaxed text-forest-900 italic">
          “{{ BGAI_MOTTO }}”
          <span class="mt-2 block text-sm font-bold tracking-[0.18em] text-coral-700 not-italic"
            >BGAI</span
          >
        </p>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import type { ImageSlot } from "~/shared/image";
import { ROUTES } from "~/shared/site-routes";
import { BGAI_MOTTO } from "../../domain/sponsorship-forms";

/** Page frame for a Back to School form: hero, the form (default slot), then the thank-you. */
const props = defineProps<{ crumb: string; image: ImageSlot; reference: string }>();

const doneEl = ref<HTMLElement | null>(null);
watch(
  () => props.reference,
  async (ref) => {
    if (!ref) return;
    await nextTick();
    doneEl.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    doneEl.value?.focus({ preventScroll: true });
  },
);
</script>
