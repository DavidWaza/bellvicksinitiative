<template>
  <div>
    <NPageHero
      eyebrow="Cause"
      :breadcrumbs="[{ label: 'Causes', to: ROUTES.causes }, { label: cause.title }]"
    >
      {{ cause.title }}
      <template #lead>{{ cause.summary }}</template>
      <template #actions>
        <NButton :to="donateHref" size="lg"
          ><NIcon name="heart" weight="fill" /> Donate to this cause</NButton
        >
        <NButton :to="focusAreaPath(cause.focusArea)" size="lg" variant="ghost" color="brand">
          About our {{ FOCUS_LABELS[cause.focusArea] }} work
        </NButton>
      </template>
      <template #media>
        <NBlobImage
          :image="cause.image"
          mask="blob-1"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.1] w-full"
        />
        <NDoodleHeart class="absolute -top-4 right-6 w-11 text-coral-500" />
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="About this cause">
      <NContainer class="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <NTodo :content="cause.status" label="Cause status">
              <NStatus :status="String(cause.status)" size="md" />
            </NTodo>
            <span class="inline-flex items-center gap-1 font-medium text-base-550">
              <NIcon name="pin" weight="duotone" class="text-forest-500" /> {{ cause.location }},
              Nigeria
            </span>
            <NBadge v-if="cause.tag" tone="mint">{{ cause.tag }}</NBadge>
          </div>
          <h2 class="font-display mt-6 text-3xl font-semibold text-forest-900">About this cause</h2>
          <NProse class="mt-4">
            <p v-for="(paragraph, i) in cause.description" :key="i">{{ paragraph }}</p>
          </NProse>
          <h2 class="font-display mt-10 text-2xl font-semibold text-forest-900">
            Your gift supports
          </h2>
          <ul role="list" class="mt-4 grid gap-2">
            <li
              v-for="item in cause.supports"
              :key="item"
              class="flex items-start gap-3 text-base-600"
            >
              <NIcon
                name="check"
                weight="fill"
                size="1.4rem"
                class="mt-0.5 shrink-0 text-accent-600"
              />
              {{ item }}
            </li>
          </ul>
        </div>

        <aside aria-label="Funding" class="lg:sticky lg:top-28 lg:self-start">
          <NCard class="gap-5 p-6">
            <h2 class="font-display text-xl font-semibold text-forest-900">Funding</h2>
            <NProgress
              v-if="hasFunding(cause)"
              :raised="cause.raised"
              :goal="cause.goal"
              :currency="cause.currency"
              :label="cause.title"
            />
            <NTodo v-else :content="TODO_CONTENT" label="Raised / goal" class="w-full">
              <template #placeholder>Raised — · Goal —</template>
              <template #fallback>
                <p class="text-sm text-base-550">Funding progress will be shared here soon.</p>
              </template>
            </NTodo>
            <NButton :to="donateHref" class="w-full"
              ><NIcon name="heart" weight="fill" /> Donate</NButton
            >
            <p class="text-sm text-base-550">
              Questions about this cause?
              <NuxtLink
                :to="ROUTES.contact"
                class="font-bold text-forest-500 underline underline-offset-4"
                >Contact us</NuxtLink
              >
            </p>
          </NCard>
        </aside>
      </NContainer>
    </NSection>

    <NSection v-if="others.length" tone="cream" labelledby="other-causes">
      <NContainer>
        <NHeading id="other-causes" size="h3" class="text-forest-900">Other causes</NHeading>
        <ul role="list" class="mt-8 grid gap-6 md:grid-cols-3">
          <li v-for="other in others" :key="other.slug" class="flex">
            <cs-list-card :cause="other" />
          </li>
        </ul>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import type { FocusAreaSlug } from "~/shared/site-routes";
import { focusAreaPath, ROUTES } from "~/shared/site-routes";
import { TODO_CONTENT } from "~/shared/todo-content";
import { hasFunding, type Cause } from "../../domain/cause-types";

const props = defineProps<{ cause: Cause }>();

const { causes } = useCauses();
const others = computed(() => causes.value.filter((c) => c.slug !== props.cause.slug));
const donateHref = computed(() => `${ROUTES.donate}?cause=${props.cause.slug}`);

const FOCUS_LABELS: Record<FocusAreaSlug, string> = {
  education: "education",
  health: "health",
  "skill-development": "skills",
  sustainability: "sustainability",
  community: "community",
  mentorship: "mentorship",
};
</script>
