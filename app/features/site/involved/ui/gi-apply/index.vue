<template>
  <div>
    <NPageHero
      eyebrow="Get involved"
      :breadcrumbs="[{ label: 'Get involved', to: ROUTES.getInvolved }, { label: way.title }]"
    >
      {{ way.title }}
      <template #lead>{{ way.blurb }}</template>
    </NPageHero>

    <NSection tone="white" aria-label="Apply">
      <NContainer class="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 class="font-display text-2xl font-semibold text-forest-900">What to expect</h2>
          <ul role="list" class="mt-5 grid gap-3">
            <li v-for="item in way.expect" :key="item" class="flex items-start gap-3 text-base-600">
              <NIcon
                name="check"
                weight="fill"
                size="1.4rem"
                class="mt-0.5 shrink-0 text-accent-600"
              />
              {{ item }}
            </li>
          </ul>
          <NBlobImage
            :image="image"
            mask="blob-4"
            sizes="xs:92vw sm:92vw md:40vw"
            class="mt-10 hidden aspect-[1.2] w-full max-w-md lg:block"
          />
        </div>

        <NCard class="p-6 sm:p-8">
          <div v-if="sent" role="status" class="flex flex-col items-center py-8 text-center">
            <NIconBlob icon="check" tone="mint" class="size-20" />
            <h2 class="font-display mt-5 text-2xl font-semibold text-forest-900">Thank you!</h2>
            <p class="mt-2 max-w-sm text-base-550">
              We've received your details. The Bellvicks team will be in touch soon.
            </p>
            <NButton class="mt-6" variant="ghost" color="brand" @click="sent = false"
              >Send another</NButton
            >
          </div>
          <template v-else>
            <h2 class="font-display text-2xl font-semibold text-forest-900">Tell us about you</h2>
            <p class="mt-1 mb-6 text-sm text-base-550">Fields marked optional can be left blank.</p>
            <slot :on-sent="() => (sent = true)" />
          </template>
        </NCard>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import type { ImageSlot } from "~/shared/image";
import { ROUTES } from "~/shared/site-routes";
import type { InvolvementWay } from "../../domain/involved-forms";

defineProps<{ way: InvolvementWay; image: ImageSlot }>();
const sent = ref(false);
</script>
