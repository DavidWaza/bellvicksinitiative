<template>
  <div>
    <NPageHero
      eyebrow="Back to School"
      eyebrow-tone="coral"
      :breadcrumbs="[{ label: 'Back to School' }]"
    >
      Every child deserves <NHeadingHighlight tone="coral">a seat in class</NHeadingHighlight>
      <template #lead>
        Our Back to School programme pays school fees for children whose parents or guardians can't
        afford them right now. Sponsor a child, or apply for support for a child in your care.
      </template>
      <template #actions>
        <NButton :to="ROUTES.sponsorChild" color="coral"
          ><NIcon name="heart" weight="fill" /> Sponsor a child</NButton
        >
        <NButton :to="ROUTES.applySponsorship" variant="ghost" color="brand"
          >Apply for sponsorship</NButton
        >
      </template>
      <template #media>
        <NBlobImage
          :image="HERO"
          mask="blob-3"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.15] w-full"
        />
        <NIconBlob icon="student" tone="sun" class="absolute -bottom-2 left-2 size-20" />
      </template>
    </NPageHero>

    <!-- The two forms -->
    <NSection tone="white" labelledby="bs-ways">
      <NContainer>
        <NEyebrow tone="coral">Two ways in</NEyebrow>
        <NHeading id="bs-ways" class="mt-4 text-forest-900"
          >How would you like to take part?</NHeading
        >
        <ul role="list" class="mt-10 grid gap-6 md:grid-cols-2">
          <li v-for="(way, i) in WAYS" :key="way.title" v-reveal="i" class="flex">
            <NCard class="w-full gap-4 p-7">
              <NIconBlob :icon="way.icon" :tone="way.tone" />
              <h3 class="font-display text-2xl font-semibold text-forest-900">{{ way.title }}</h3>
              <p class="text-base-550">{{ way.text }}</p>
              <ul role="list" class="grid gap-2 text-sm text-base-600">
                <li v-for="point in way.points" :key="point" class="flex items-start gap-2">
                  <NIcon name="check" weight="fill" class="mt-0.5 shrink-0 text-accent-600" />
                  {{ point }}
                </li>
              </ul>
              <NButton :to="way.href" color="brand" class="mt-auto">
                {{ way.cta }} <NIcon name="arrowRight" />
              </NButton>
            </NCard>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <!-- What it costs -->
    <NSection tone="cream" labelledby="bs-costs">
      <NContainer class="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <NEyebrow tone="coral">What a sponsorship covers</NEyebrow>
          <NHeading id="bs-costs" class="mt-4 text-forest-900"
            >School fees, and the basics</NHeading
          >
          <p class="mt-5 text-lg text-base-600">
            The BGAI standard rate of school fee is
            <strong class="text-forest-900"
              >{{ formatMoney(SCHOOL_FEE_PER_TERM_NGN) }} per term</strong
            >. Sponsors choose how many children, for one to six years, and pay yearly or at once.
            They can also give a child the school items they need each year.
          </p>
        </div>
        <div class="overflow-hidden rounded-3xl bg-base-0 shadow-soft">
          <table class="w-full text-left">
            <caption class="sr-only">
              Child's school items, per year
            </caption>
            <thead class="bg-forest-900 text-sm text-base-0">
              <tr>
                <th scope="col" class="px-5 py-3 font-bold">Resources / items</th>
                <th scope="col" class="px-5 py-3 font-bold">Qty.</th>
                <th scope="col" class="px-5 py-3 text-right font-bold">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in SCHOOL_ITEMS" :key="item.id" class="border-t border-base-150">
                <th scope="row" class="px-5 py-3 font-medium text-base-900">{{ item.label }}</th>
                <td class="px-5 py-3 text-base-550">{{ item.quantity || "—" }}</td>
                <td class="px-5 py-3 text-right font-bold text-forest-900">
                  {{ formatMoney(item.cost) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </NContainer>
    </NSection>

    <!-- BGAI's belief, as printed on the forms -->
    <NSection tone="lavender" spacing="sm" aria-label="Our belief">
      <NContainer size="narrow">
        <figure class="text-center">
          <blockquote class="font-display text-2xl leading-relaxed text-forest-900 sm:text-3xl">
            “{{ BGAI_MOTTO }}”
          </blockquote>
          <figcaption class="mt-4 text-sm font-bold tracking-[0.18em] text-coral-700">
            BGAI
          </figcaption>
        </figure>
      </NContainer>
    </NSection>

    <!-- Good to know -->
    <NSection tone="white" labelledby="bs-know">
      <NContainer>
        <NEyebrow tone="coral">Good to know</NEyebrow>
        <NHeading id="bs-know" class="mt-4 text-forest-900">How the programme works</NHeading>
        <ul role="list" class="mt-8 grid gap-4 md:grid-cols-2">
          <li
            v-for="(item, i) in GOOD_TO_KNOW"
            :key="item.title"
            v-reveal="i"
            class="flex gap-4 rounded-2xl border border-base-150/70 bg-base-50 p-5"
          >
            <NIcon
              :name="item.icon"
              weight="duotone"
              size="1.75rem"
              class="shrink-0 text-forest-500"
            />
            <div>
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ item.title }}</h3>
              <p class="mt-1 text-base-550">{{ item.text }}</p>
            </div>
          </li>
        </ul>
        <p class="mt-8 text-base-600">
          For supervision of community back to school project/sponsorship in your constituency,
          please
          <NuxtLink
            :to="ROUTES.contact"
            class="font-bold text-forest-900 underline underline-offset-2"
            >contact us</NuxtLink
          >.
        </p>
      </NContainer>
    </NSection>

    <NCtaBand eyebrow="Back to School">
      Help a child get back to school.
      <template #actions>
        <NButton :to="ROUTES.sponsorChild" size="lg"
          ><NIcon name="heart" weight="fill" /> Sponsor a child</NButton
        >
        <NButton :to="ROUTES.applySponsorship" size="lg" variant="ghost" color="light"
          >Apply for sponsorship</NButton
        >
      </template>
    </NCtaBand>
  </div>
</template>

<script setup lang="ts">
import { photo } from "~/shared/photos";
import { ROUTES } from "~/shared/site-routes";
import { formatMoney } from "~/utils/format-money";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import {
  BGAI_MOTTO,
  DISCLAIMER,
  RECIPIENT_NOTE,
  SCHOOL_FEE_PER_TERM_NGN,
  SCHOOL_ITEMS,
  SPONSOR_APPRECIATION,
} from "../../domain/sponsorship-forms";

const HERO = photo("/images/back-to-school/hero.jpg", "classroomPupils", "Pupils in a classroom");

const WAYS: {
  title: string;
  text: string;
  points: string[];
  href: string;
  cta: string;
  icon: IconName;
  tone: Tone;
}[] = [
  {
    title: "Sponsor a child",
    text: `For individuals and organisations. ${SPONSOR_APPRECIATION}`,
    points: [
      `School fees at ${formatMoney(SCHOOL_FEE_PER_TERM_NGN)} per term`,
      "One to six years, paid yearly or at once",
      "Optionally, the child's school items each year",
    ],
    href: ROUTES.sponsorChild,
    cta: "Sponsor a child",
    icon: "sponsor",
    tone: "coral",
  },
  {
    title: "Apply for sponsorship",
    text: "For parents and guardians who can't afford a child's school fees at the moment.",
    points: [
      "Details of the child, the school and the parent / guardian",
      "Confirmed by the school and a witness / next of kin",
      "Passport photographs of the child and the parent / guardian",
    ],
    href: ROUTES.applySponsorship,
    cta: "Apply for sponsorship",
    icon: "student",
    tone: "sky",
  },
];

const GOOD_TO_KNOW: { title: string; text: string; icon: IconName }[] = [
  {
    title: "School fees only",
    text: "The purpose of a sponsorship is solely to help pay the child's school fees, as the parent/guardian can not afford it at the moment.",
    icon: "education",
  },
  {
    title: "The child stays with their family",
    text: "The child is not the sponsor's, does not bear the sponsor's name and does not live with the sponsor. Sponsors don't visit without the prior knowledge of the parent/guardian, school authority and BGAI.",
    icon: "community",
  },
  {
    title: "Care stays with the parents",
    text: DISCLAIMER[0]!,
    icon: "health",
  },
  {
    title: "A privilege, not a right",
    text: RECIPIENT_NOTE,
    icon: "info",
  },
];
</script>
