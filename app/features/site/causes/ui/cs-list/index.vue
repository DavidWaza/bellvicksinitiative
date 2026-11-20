<template>
  <div>
    <NPageHero eyebrow="Our causes" :breadcrumbs="[{ label: 'Causes' }]">
      Support a cause <NHeadingHighlight>today</NHeadingHighlight>
      <template #lead>
        Books for out-of-school children, healthy food and clean water. Choose a cause and help us
        reach more children and families.
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="Causes">
      <NContainer>
        <NChoiceGroup
          v-model="filter"
          legend="Filter by location"
          name="cause-location"
          :options="FILTERS"
        />
        <p class="sr-only" role="status" aria-live="polite">{{ visible.length }} causes shown</p>

        <ul v-if="!isLoading" role="list" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <li v-for="cause in visible" :key="cause.slug" class="flex">
            <cs-list-card :cause="cause" />
          </li>
        </ul>
        <div v-else aria-busy="true" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div v-for="i in 4" :key="i" class="h-[28rem] animate-pulse rounded-2xl bg-base-100" />
        </div>
      </NContainer>
    </NSection>

    <NSection tone="mint" labelledby="give-title">
      <NContainer class="grid gap-10 lg:grid-cols-3">
        <div class="lg:col-span-1">
          <NEyebrow>How giving works</NEyebrow>
          <NHeading id="give-title" class="mt-4 text-forest-900">Your gift, put to work</NHeading>
        </div>
        <ol role="list" class="grid gap-4 sm:grid-cols-3 lg:col-span-2">
          <li
            v-for="(step, i) in STEPS"
            :key="step.title"
            class="rounded-2xl bg-base-0 p-5 shadow-soft"
          >
            <span
              class="font-display flex size-10 items-center justify-center rounded-full bg-accent-50 text-lg font-semibold text-accent-700"
              aria-hidden="true"
            >
              {{ i + 1 }}
            </span>
            <h3 class="font-display mt-4 text-lg font-semibold text-forest-900">
              {{ step.title }}
            </h3>
            <p class="mt-1.5 text-sm text-base-550">{{ step.text }}</p>
          </li>
        </ol>
      </NContainer>
    </NSection>

    <NCtaBand eyebrow="Other ways to help">
      Can't give today? Give your time.
      <template #actions>
        <NButton :to="ROUTES.volunteer" size="lg">Volunteer with us</NButton>
        <NButton :to="ROUTES.partner" size="lg" variant="ghost" color="light"
          >Partner with us</NButton
        >
      </template>
    </NCtaBand>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import { CAUSE_LOCATIONS, type CauseLocation } from "../../domain/cause-types";

const { visible, location, setLocation, isLoading } = useCauses();

const FILTERS = [
  { value: "all", label: "All locations" },
  ...CAUSE_LOCATIONS.map((l) => ({ value: l, label: l })),
];
const filter = computed({
  get: () => location.value,
  set: (v: string) => setLocation(v as CauseLocation | "all"),
});

const STEPS = [
  {
    title: "Choose a cause",
    text: "Pick the cause you care about, or give where the need is greatest.",
  },
  { title: "Make your gift", text: "Give once or monthly, in NGN, USD, GBP, EUR or CAD." },
  {
    title: "We deliver",
    text: "We work with local communities and partners to deliver on the ground.",
  },
];
</script>
