<template>
  <div class="pb-24">
    <NSection tone="white" spacing="sm">
      <NContainer>
        <NEyebrow>Dev only · not indexed · 404 in production</NEyebrow>
        <NHeading as="h1" size="display" class="mt-4 text-forest-900">
          Design <NHeadingHighlight>system</NHeadingHighlight>
        </NHeading>
        <p class="mt-4 max-w-2xl text-base-550">
          Tokens live in <code>app/assets/css/tailwind.css</code>. Components are catalogued in
          <code>docs/index.md</code>. Contrast pairs are in <code>docs/design/contrast.md</code>.
        </p>
      </NContainer>
    </NSection>

    <NContainer class="mt-12 flex flex-col gap-16">
      <!-- Colour -->
      <section aria-labelledby="sg-colour">
        <h2 id="sg-colour" :class="H2">Colour ramps</h2>
        <div class="mt-6 flex flex-col gap-4">
          <div v-for="ramp in RAMPS" :key="ramp.name" class="flex flex-wrap items-center gap-3">
            <span class="w-20 text-sm font-bold text-base-900">{{ ramp.name }}</span>
            <div v-for="step in ramp.steps" :key="step" class="flex flex-col items-center gap-1">
              <span
                class="size-14 rounded-xl border border-base-150"
                :style="{ background: `var(--${ramp.var ?? ramp.name}-${step})` }"
              />
              <span class="text-xs text-base-550">{{ step }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Type -->
      <section aria-labelledby="sg-type">
        <h2 id="sg-type" :class="H2">Type scale</h2>
        <div class="mt-6 flex flex-col gap-5">
          <NHeading as="h3" size="display">Display · Fraunces 600 SOFT 50</NHeading>
          <NHeading as="h3" size="h2">H2 · Programmes that make a difference</NHeading>
          <NHeading as="h3" size="h3">H3 · Clean water for Lokoja</NHeading>
          <NHeading as="h3" size="h4">H4 · Card title</NHeading>
          <p class="max-w-2xl">
            Body · DM Sans 17/16px, line height 1.6. A world where every child and vulnerable person
            has access to education, opportunity and the resources they need to thrive.
          </p>
          <NEyebrow>Eyebrow · DM Sans 700 · 12px · 0.18em</NEyebrow>
          <p class="font-hand text-3xl text-coral-700">Caveat accent · Since 2014 ♥</p>
        </div>
      </section>

      <!-- Buttons -->
      <section aria-labelledby="sg-buttons">
        <h2 id="sg-buttons" :class="H2">Buttons (colour × variant)</h2>
        <div class="mt-6 flex flex-col gap-4">
          <div
            v-for="color in COLORS"
            :key="color"
            :class="
              cn(
                'flex flex-wrap items-center gap-3 rounded-2xl p-4',
                color === 'light' && 'bg-forest-900',
              )
            "
          >
            <NButton v-for="variant in VARIANTS" :key="variant" :color="color" :variant="variant">
              <NIcon name="heart" weight="fill" /> {{ color }} / {{ variant }}
            </NButton>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <NButton size="sm">Small</NButton>
            <NButton>Default</NButton>
            <NButton size="lg">Large</NButton>
            <NButton size="icon" aria-label="Icon button"
              ><NIcon name="heart" weight="fill"
            /></NButton>
            <NButton disabled>Disabled</NButton>
          </div>
        </div>
      </section>

      <!-- Badges / status -->
      <section aria-labelledby="sg-badges">
        <h2 id="sg-badges" :class="H2">Badges, stickers, status</h2>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <NBadge v-for="tone in TONES" :key="tone" :tone="tone">{{ tone }}</NBadge>
          <NSticker />
          <NStatus v-for="s in CAUSE_STATUSES" :key="s" :status="s" />
          <NStatus status="fully_funded" size="md" />
        </div>
      </section>

      <!-- Masks -->
      <section aria-labelledby="sg-masks">
        <h2 id="sg-masks" :class="H2">Masks</h2>
        <div class="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          <figure v-for="mask in MASK_NAMES" :key="mask" class="flex flex-col items-center gap-2">
            <NBlobImage
              :mask="mask"
              alt=""
              consent="not-required"
              :class="mask === 'africa' ? 'aspect-[0.956] w-full' : 'aspect-square w-full'"
            />
            <figcaption class="text-sm text-base-550">{{ mask }}</figcaption>
          </figure>
        </div>
      </section>

      <!-- Doodles -->
      <section aria-labelledby="sg-doodles">
        <h2 id="sg-doodles" :class="H2">Doodles & textures</h2>
        <div class="mt-6 flex flex-wrap items-end gap-8 text-coral-500">
          <figure v-for="d in DOODLES" :key="d.name" class="flex flex-col items-center gap-2">
            <component :is="d.component" class="h-12 w-auto" />
            <figcaption class="text-sm text-base-550">{{ d.name }}</figcaption>
          </figure>
        </div>
        <div class="relative mt-8 rounded-3xl bg-base-0 p-6">
          <NDotMap class="w-full opacity-[0.25]" />
        </div>
      </section>

      <!-- Icon blobs, stats, progress -->
      <section aria-labelledby="sg-data">
        <h2 id="sg-data" :class="H2">Icon blobs, stats, progress</h2>
        <div class="mt-6 flex flex-wrap gap-4">
          <NIconBlob
            v-for="(tone, i) in TONES"
            :key="tone"
            :tone="tone"
            :icon="ICON_SAMPLE[i % ICON_SAMPLE.length]!"
          />
        </div>
        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <NCard class="p-6"
            ><NStat :value="1250" label="Real number (counts up)" suffix="+" icon="books"
          /></NCard>
          <NCard class="p-6"
            ><NStat :value="TODO_CONTENT" label="TODO_CONTENT value" icon="community"
          /></NCard>
        </div>
        <NCard class="mt-6 max-w-md p-6">
          <NProgress :raised="420000" :goal="1000000" label="Styleguide sample" />
        </NCard>
      </section>

      <!-- Forms -->
      <section aria-labelledby="sg-forms">
        <h2 id="sg-forms" :class="H2">Fields</h2>
        <div class="mt-6 grid max-w-xl gap-5">
          <NField
            v-slot="{ id, describedby, invalid }"
            label="Default"
            hint="A hint under the field"
          >
            <NInput :id="id" :aria-describedby="describedby" :invalid="invalid" />
          </NField>
          <NField
            v-slot="{ id, describedby, invalid }"
            label="With error"
            error="This field is required."
          >
            <NInput :id="id" :aria-describedby="describedby" :invalid="invalid" />
          </NField>
        </div>
      </section>

      <!-- Books -->
      <section aria-labelledby="sg-books" class="rounded-3xl bg-lavender-50 p-8">
        <h2 id="sg-books" :class="H2">Cover stack (storybook sample covers)</h2>
        <NCoverStack class="mt-8" :covers="SAMPLE_COVERS" />
      </section>
    </NContainer>
  </div>
</template>

<script setup lang="ts">
import { SAMPLE_COVERS } from "~/shared/storybook-samples";
import { MASK_NAMES } from "~/components/n/blob-image/mask-paths";
import NDoodleCrown from "~/components/n/doodle/NDoodleCrown.vue";
import NDoodleDotCluster from "~/components/n/doodle/NDoodleDotCluster.vue";
import NDoodleHeart from "~/components/n/doodle/NDoodleHeart.vue";
import NDoodleLeaf from "~/components/n/doodle/NDoodleLeaf.vue";
import NDoodleSpark from "~/components/n/doodle/NDoodleSpark.vue";
import NDoodleSquiggle from "~/components/n/doodle/NDoodleSquiggle.vue";
import NDoodleSwoosh from "~/components/n/doodle/NDoodleSwoosh.vue";
import { TODO_CONTENT } from "~/shared/todo-content";
import type { IconName } from "~/utils/icons";
import { CAUSE_STATUSES } from "~/utils/status";
import type { Tone } from "~/utils/tones";

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

useSeoMeta({ title: "Styleguide — Bellvicks (dev)", robots: "noindex, nofollow" });

const H2 = "font-display text-2xl font-semibold text-forest-900";

const RAMPS: { name: string; var?: string; steps: (string | number)[] }[] = [
  { name: "base", steps: [0, 50, 100, 150, 400, 500, 550, 600, 900, 950] },
  { name: "forest", steps: [50, 100, 150, 500, 600, 900] },
  { name: "accent", steps: [50, 100, 150, 500, 600, 700] },
  { name: "coral", steps: [50, 100, 150, 500, 600, 700] },
  { name: "sun", steps: [50, 100, 150, 500, 600] },
  { name: "lavender", steps: [50, 100, 150, 500, 600] },
  { name: "sky", steps: [50, 100, 150, 500, 600, 700] },
  { name: "green", steps: [50, 100, 150, 500, 600] },
  { name: "red", steps: [50, 100, 150, 500, 600] },
  { name: "yellow", steps: [50, 100, 150, 500, 600] },
];

const COLORS = ["primary", "brand", "coral", "light"] as const;
const VARIANTS = ["solid", "ghost", "link"] as const;
const TONES: Tone[] = ["mint", "lavender", "sun", "coral", "sky", "accent", "forest"];
const ICON_SAMPLE: IconName[] = [
  "education",
  "health",
  "skills",
  "sustainability",
  "community",
  "mentorship",
  "books",
];

const DOODLES = [
  { name: "spark", component: NDoodleSpark },
  { name: "swoosh", component: NDoodleSwoosh },
  { name: "heart", component: NDoodleHeart },
  { name: "crown", component: NDoodleCrown },
  { name: "squiggle", component: NDoodleSquiggle },
  { name: "dot-cluster", component: NDoodleDotCluster },
  { name: "leaf", component: NDoodleLeaf },
];
</script>
