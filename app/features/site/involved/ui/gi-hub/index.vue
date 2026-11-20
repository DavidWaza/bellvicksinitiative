<template>
  <div>
    <NPageHero eyebrow="Get involved" :breadcrumbs="[{ label: 'Get involved' }]">
      Be the reason a child <NHeadingHighlight>turns the page</NHeadingHighlight>
      <template #lead>
        Volunteers, mentors, partners and donors make our work possible. Find the way of helping
        that suits you.
      </template>
      <template #media>
        <NBlobImage
          :image="HERO_IMAGE"
          mask="blob-3"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.15] w-full"
        />
        <NDoodleSpark class="absolute -top-4 left-6 w-12 text-sun-500" />
      </template>
    </NPageHero>

    <NSection tone="white" aria-label="Ways to get involved">
      <NContainer>
        <ul role="list" class="grid gap-6 md:grid-cols-3">
          <li v-for="(way, i) in INVOLVEMENT_WAYS" :key="way.kind" v-reveal="i" class="flex">
            <NCard class="w-full gap-4 p-6">
              <NIconBlob :icon="way.icon" :tone="way.tone" />
              <h2 class="font-display text-2xl font-semibold text-forest-900">{{ way.title }}</h2>
              <p class="text-base-550">{{ way.blurb }}</p>
              <ul role="list" class="grid gap-2 text-sm text-base-600">
                <li v-for="item in way.expect" :key="item" class="flex items-start gap-2">
                  <NIcon name="check" weight="fill" class="mt-0.5 shrink-0 text-accent-600" />
                  {{ item }}
                </li>
              </ul>
              <NButton :to="way.href" color="brand" class="mt-auto">
                {{ way.title }} <NIcon name="arrowRight" />
              </NButton>
            </NCard>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <NSection tone="lavender" labelledby="more-ways">
      <NContainer class="grid gap-8 md:grid-cols-2">
        <div>
          <NEyebrow tone="coral">More ways to help</NEyebrow>
          <NHeading id="more-ways" class="mt-4 text-forest-900">Every bit counts</NHeading>
        </div>
        <ul role="list" class="grid gap-4">
          <li v-for="item in MORE" :key="item.title">
            <NuxtLink
              :to="item.href"
              class="group flex items-center gap-4 rounded-2xl bg-base-0 p-5 shadow-soft"
            >
              <NIconBlob :icon="item.icon" :tone="item.tone" class="size-12" />
              <span class="flex-1">
                <span class="font-display block text-lg font-semibold text-forest-900">{{
                  item.title
                }}</span>
                <span class="block text-sm text-base-550">{{ item.text }}</span>
              </span>
              <NIcon
                name="arrowRight"
                class="text-forest-500 transition-transform group-hover:translate-x-0.5"
              />
            </NuxtLink>
          </li>
        </ul>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { photo } from "~/shared/photos";
import { ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import { INVOLVEMENT_WAYS } from "../../domain/involved-forms";

const HERO_IMAGE = photo("/images/involved/hero.jpg", "volunteers", "Bellvicks volunteers");

const MORE: { title: string; text: string; href: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Send Relief",
    text: "Give once or monthly to a cause you care about.",
    href: ROUTES.donate,
    icon: "heart",
    tone: "coral",
  },
  {
    title: "Gift a book",
    text: "Put a story into a child's hands.",
    href: ROUTES.storybook,
    icon: "gift",
    tone: "sun",
  },
  {
    title: "Sponsorship",
    text: "Talk to us about sponsoring a child or a programme.",
    href: ROUTES.contact,
    icon: "sponsor",
    tone: "sky",
  },
];
</script>
