<template>
  <div>
    <NPageHero eyebrow="About us" :breadcrumbs="[{ label: 'About' }]">
      Empowering communities. <NHeadingHighlight tone="coral">Inspiring change.</NHeadingHighlight>
      <template #lead>{{ ABOUT.vision }}</template>
      <template #actions>
        <NButton :to="ROUTES.whatWeDo">What we do <NIcon name="arrowRight" /></NButton>
        <NButton :to="ROUTES.contact" variant="ghost" color="brand">Contact us</NButton>
      </template>
      <template #media>
        <NBlobImage
          :image="ABOUT.heroImage"
          mask="blob-2"
          preload
          sizes="xs:92vw sm:92vw md:45vw lg:560px"
          class="aspect-[1.1] w-full"
        />
        <NDoodleCrown class="absolute -top-6 left-[28%] w-16 -rotate-6 text-sun-500" />
      </template>
    </NPageHero>

    <!-- Story -->
    <NSection tone="white" labelledby="story-title">
      <NContainer class="grid items-center gap-12 lg:grid-cols-2">
        <NBlobImage
          :image="ABOUT.storyImage"
          mask="blob-4"
          sizes="xs:92vw sm:92vw md:45vw"
          class="aspect-[1.2] w-full"
        />
        <div>
          <NEyebrow>Our story</NEyebrow>
          <NHeading id="story-title" class="mt-4 text-forest-900"
            >Working with communities since 2014</NHeading
          >
          <NProse class="mt-5">
            <p v-for="(p, i) in ABOUT.story" :key="i">{{ p }}</p>
          </NProse>
        </div>
      </NContainer>
    </NSection>

    <!-- Mission & vision -->
    <NSection tone="mint" aria-label="Mission and vision">
      <NContainer class="grid gap-6 md:grid-cols-2">
        <NCard v-reveal class="gap-4 p-8">
          <NIconBlob icon="mission" tone="coral" />
          <h2 class="font-display text-2xl font-semibold text-forest-900">Our mission</h2>
          <p class="text-base-600">{{ ABOUT.mission }}</p>
        </NCard>
        <NCard v-reveal="1" class="gap-4 p-8">
          <NIconBlob icon="vision" tone="sky" />
          <h2 class="font-display text-2xl font-semibold text-forest-900">Our vision</h2>
          <p class="text-base-600">{{ ABOUT.vision }}</p>
        </NCard>
      </NContainer>
    </NSection>

    <!-- Values -->
    <NSection tone="cream" labelledby="values-title">
      <NContainer>
        <NEyebrow>What we stand for</NEyebrow>
        <NHeading id="values-title" class="mt-4 text-forest-900">Our values</NHeading>
        <ul role="list" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="(value, i) in VALUES" :key="value.title" v-reveal="i" class="flex">
            <NCard class="w-full gap-4 p-6">
              <NIconBlob :icon="value.icon" :tone="value.tone" />
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ value.title }}</h3>
              <p class="text-[0.9375rem] text-base-550">{{ value.text }}</p>
            </NCard>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <!-- Team (hidden in production until real names exist) -->
    <NSection v-if="showTeam" tone="white" labelledby="team-title">
      <NContainer>
        <NEyebrow>Our people</NEyebrow>
        <NHeading id="team-title" class="mt-4 text-forest-900">Meet the team</NHeading>
        <ul role="list" class="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <li
            v-for="(member, i) in TEAM"
            :key="member.id"
            class="flex flex-col items-center text-center"
          >
            <span
              aria-hidden="true"
              :class="
                cn(
                  'flex size-28 items-end justify-center overflow-hidden rounded-full',
                  TONE_CLASSES[TEAM_TONES[i % TEAM_TONES.length]!].mid,
                )
              "
            >
              <svg
                viewBox="0 0 24 24"
                :class="
                  cn('size-24 translate-y-2', TONE_CLASSES[TEAM_TONES[i % TEAM_TONES.length]!].ink)
                "
              >
                <circle cx="12" cy="9" r="4" fill="currentColor" />
                <path d="M4 22c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5Z" fill="currentColor" />
              </svg>
            </span>
            <p class="mt-4 font-bold text-base-900">
              <NTodo :content="member.name" label="Name"
                >{{ member.name }}<template #placeholder>Name</template></NTodo
              >
            </p>
            <p class="mt-1 text-sm text-base-550">
              <NTodo :content="member.role" label="Role"
                >{{ member.role }}<template #placeholder>Role</template></NTodo
              >
            </p>
          </li>
        </ul>
      </NContainer>
    </NSection>

    <!-- Partners + registration -->
    <NSection tone="cream" labelledby="partners-title">
      <NContainer>
        <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <NEyebrow>Partners</NEyebrow>
            <NHeading id="partners-title" class="mt-4 text-forest-900"
              >Trusted by our partners</NHeading
            >
            <p class="mt-4 text-base-550">
              We're grateful to the organisations that support our work.
            </p>
            <NButton :to="ROUTES.partner" variant="link" color="brand" class="mt-4">
              Become a partner <NIcon name="arrowRight" />
            </NButton>
          </div>
          <ul role="list" class="grid grid-cols-2 gap-4">
            <li
              v-for="partner in PARTNERS"
              :key="partner.name"
              class="flex min-h-28 items-center justify-center rounded-2xl bg-base-0 p-5 shadow-soft"
            >
              <NPartnerLogo
                :name="partner.name"
                :logo="partner.logo"
                class="h-16 w-full max-w-48"
              />
            </li>
          </ul>
        </div>
        <p class="mt-12 border-t border-base-150 pt-6 text-sm text-base-550">
          {{ SITE_INFO.legalName }} ({{ SITE_INFO.abbreviation }}).
          <NTodo :content="ABOUT.registrationNumber" label="CAC registration number">
            Registered with the Corporate Affairs Commission, Nigeria:
            {{ ABOUT.registrationNumber }}.
          </NTodo>
        </p>
      </NContainer>
    </NSection>

    <NCtaBand eyebrow="Join us">
      Help us build the future we want to see in Africa.
      <template #actions>
        <NButton :to="ROUTES.donate" size="lg"
          ><NIcon name="heart" weight="fill" /> Send Relief</NButton
        >
        <NButton :to="ROUTES.getInvolved" size="lg" variant="ghost" color="light"
          >Get involved</NButton
        >
      </template>
    </NCtaBand>
  </div>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";
import { TONE_CLASSES, type Tone } from "~/utils/tones";
import { ABOUT, hasTeam, PARTNERS, TEAM, VALUES } from "../../domain/about-content";

const showTeam = hasTeam(import.meta.dev);
const TEAM_TONES: Tone[] = ["coral", "sky", "sun", "lavender"];
</script>
