<template>
  <NSection tone="cream" spacing="none" labelledby="step-title" class="min-h-[70vh] py-8 md:py-12">
    <NContainer>
      <div :class="cn('mx-auto w-full', step === 'pick' ? 'max-w-6xl' : 'max-w-xl')">
        <!-- Progress + back -->
        <div v-if="step !== 'pick' && !isGenerating" class="mb-8 flex items-center gap-4">
          <button
            v-if="stepIndex > 0"
            type="button"
            class="-ml-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-900 transition-colors hover:bg-base-100"
            aria-label="Previous step"
            @click="back"
          >
            <NIcon name="arrowLeft" size="1.35rem" />
          </button>
          <div class="flex-1">
            <p class="mb-2 text-sm font-bold text-base-550">
              Step {{ stepIndex + 1 }} of {{ formSteps }}
            </p>
            <div
              role="progressbar"
              :aria-valuenow="stepIndex + 1"
              aria-valuemin="1"
              :aria-valuemax="formSteps"
              :aria-valuetext="`Step ${stepIndex + 1} of ${formSteps}`"
              aria-label="Storybook progress"
              class="h-2 overflow-hidden rounded-full bg-coral-100"
            >
              <div
                class="h-full rounded-full bg-coral-500 transition-[width] duration-500 ease-out"
                :style="{ width: `${((stepIndex + 1) / formSteps) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Writing the books -->
        <sb-wizard-writing v-if="isGenerating" :name="draft.name" />

        <!-- Order request sent -->
        <div
          v-else-if="orderReference"
          role="status"
          class="mx-auto flex max-w-lg flex-col items-center py-10 text-center"
        >
          <NIconBlob icon="send" tone="mint" class="size-20" />
          <h1
            id="step-title"
            ref="headingEl"
            tabindex="-1"
            class="font-display mt-6 text-3xl font-semibold text-forest-900 outline-none"
          >
            Request received
          </h1>
          <p class="mt-3 text-base-600">
            Thank you! We'll email <strong class="text-base-900">{{ draft.email }}</strong> with the
            price and delivery details for
            {{ selectedBooks.length === 1 ? "your book" : "your books" }}. Nothing has been charged.
          </p>
          <p class="mt-2 text-sm text-base-550">Reference: {{ orderReference }}</p>
          <ul role="list" class="mt-6 flex flex-col gap-1 font-bold text-forest-900">
            <li v-for="book in selectedBooks" :key="book.id">{{ book.title }}</li>
          </ul>
          <NButton class="mt-8" variant="ghost" color="brand" @click="startOver"
            >Create another storybook</NButton
          >
        </div>

        <template v-else>
          <header :class="step === 'pick' && 'text-center'">
            <h1
              id="step-title"
              ref="headingEl"
              tabindex="-1"
              class="font-display text-3xl font-semibold text-forest-900 outline-none md:text-4xl"
            >
              {{ copy.title }}
            </h1>
            <p v-if="copy.lead" class="mt-3 text-lg text-base-600">{{ copy.lead }}</p>
          </header>

          <form class="mt-8" novalidate @submit.prevent="onContinue">
            <!-- 1. Name -->
            <div v-if="step === 'name'">
              <label for="sb-name" class="sr-only">Child's name or nickname</label>
              <div class="relative">
                <NInput
                  id="sb-name"
                  v-model="draft.name"
                  autocomplete="off"
                  :maxlength="NAME_MAX"
                  placeholder="e.g. Amara"
                  class="h-14 pr-14 text-lg"
                />
                <sb-wizard-clear-button v-if="draft.name" @click="draft.name = ''" />
              </div>
            </div>

            <!-- 2. Basics -->
            <NCard v-else-if="step === 'basics'" class="gap-7 p-6">
              <fieldset>
                <legend class="mb-3 font-bold text-base-900">Gender</legend>
                <div class="grid grid-cols-2 gap-3">
                  <label v-for="g in GENDERS" :key="g.value" class="relative">
                    <input
                      v-model="draft.gender"
                      type="radio"
                      name="sb-gender"
                      :value="g.value"
                      class="peer sr-only"
                    />
                    <span :class="PILL">
                      <NIcon :name="g.icon" size="1.25rem" /> {{ g.label }}
                    </span>
                  </label>
                </div>
              </fieldset>
              <sb-wizard-age-stepper v-model="draft.age" :min="AGE_MIN" :max="AGE_MAX" />
            </NCard>

            <!-- 3. About -->
            <sb-wizard-questions
              v-else-if="step === 'about'"
              v-model="draft.answers"
              :name="draft.name"
            />

            <!-- 4. Photo + eye colour -->
            <div v-else-if="step === 'photo'" class="flex flex-col gap-8">
              <sb-wizard-photo-picker
                v-model:photo-url="photoUrl"
                v-model:consent="draft.guardianConsent"
                :name="draft.name"
              />
              <fieldset>
                <legend class="mb-3 font-bold text-base-900">Eye colour</legend>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <label v-for="e in EYE_COLOURS" :key="e.value" class="relative">
                    <input
                      v-model="draft.eyeColour"
                      type="radio"
                      name="sb-eyes"
                      :value="e.value"
                      class="peer sr-only"
                    />
                    <span :class="PILL">
                      <span
                        aria-hidden="true"
                        class="size-4 rounded-full ring-2 ring-base-0 ring-offset-1 ring-offset-base-500"
                        :style="{ background: e.swatch }"
                      />
                      {{ e.label }}
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>

            <!-- 5. From -->
            <div v-else-if="step === 'from'">
              <label for="sb-from" class="sr-only">Who the book is from</label>
              <div class="relative">
                <NInput
                  id="sb-from"
                  v-model="draft.from"
                  autocomplete="name"
                  maxlength="40"
                  placeholder="e.g. Mummy and Daddy"
                  class="h-14 pr-14 text-lg"
                />
                <sb-wizard-clear-button v-if="draft.from" @click="draft.from = ''" />
              </div>
            </div>

            <!-- 6. Dedication -->
            <div v-else-if="step === 'dedication'">
              <label for="sb-dedication" class="sr-only">Dedication</label>
              <NTextarea
                id="sb-dedication"
                v-model="draft.dedication"
                :rows="6"
                :maxlength="DEDICATION_MAX"
                aria-describedby="sb-dedication-count"
                class="text-base"
              />
              <p id="sb-dedication-count" class="mt-2 text-right text-sm font-bold text-base-550">
                {{ draft.dedication.length }}/{{ DEDICATION_MAX }} characters
              </p>
            </div>

            <!-- 7. Email -->
            <div v-else-if="step === 'email'">
              <label for="sb-email" class="sr-only">Email address</label>
              <NInput
                id="sb-email"
                v-model="draft.email"
                type="email"
                autocomplete="email"
                placeholder="Enter your email"
                class="h-14 text-lg"
              />
            </div>

            <!-- 8. Pick -->
            <sb-wizard-pick
              v-else-if="step === 'pick'"
              :books="books"
              :selected="selected"
              :name="draft.name"
              :from="draft.from"
              :dedication="draft.dedication"
              :photo-url="photoUrl"
              @toggle="toggleBook"
            />

            <!-- Primary action -->
            <div v-if="step !== 'pick'" class="mt-8">
              <NButton
                type="submit"
                size="lg"
                color="coral"
                class="h-14 w-full text-lg"
                :disabled="!canContinue"
              >
                <template v-if="step === 'email'">
                  Write my books <NIcon name="impact" weight="fill" />
                </template>
                <template v-else-if="step === 'about' && !hasAnswers">Skip</template>
                <template v-else>Continue</template>
              </NButton>
              <p v-if="step === 'email'" class="mt-5 text-center text-sm text-base-550">
                By continuing, you agree to our
                <NuxtLink :to="ROUTES.terms" class="underline underline-offset-2">Terms</NuxtLink>
                and
                <NuxtLink :to="ROUTES.privacy" class="underline underline-offset-2"
                  >Privacy Policy</NuxtLink
                >. We only use your email to send your books and follow up on your order.
              </p>
            </div>

            <!-- Sticky selection bar -->
            <div
              v-else
              class="sticky bottom-4 z-20 mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-forest-900 px-5 py-3 text-base-0 shadow-2xl"
            >
              <p class="font-bold" aria-live="polite">
                {{
                  selected.length
                    ? `${selected.length} ${selected.length === 1 ? "book" : "books"} selected`
                    : "Pick one or more books"
                }}
              </p>
              <NButton
                type="button"
                color="coral"
                :disabled="!selected.length || isOrdering"
                @click="onOrder"
              >
                <NIcon
                  :name="isOrdering ? 'spinner' : 'cart'"
                  :class="isOrdering && 'animate-spin'"
                />
                {{ isOrdering ? "Sending…" : "Request my books" }}
              </NButton>
            </div>
          </form>

          <p v-if="step === 'pick'" class="mt-6 text-center text-sm text-base-550">
            No payment is taken here: we'll email you the price and delivery details to confirm.
          </p>
        </template>
      </div>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";
import {
  AGE_MAX,
  AGE_MIN,
  DEDICATION_MAX,
  EYE_COLOURS,
  GENDERS,
  NAME_MAX,
  type StepId,
} from "../../domain/storybook-types";

/**
 * The storybook wizard: eight steps in one page. Each step change moves focus to the new heading
 * so screen-reader and keyboard users hear where they are.
 */
const {
  draft,
  step,
  stepIndex,
  formSteps,
  canContinue,
  next,
  back,
  books,
  selected,
  toggleBook,
  requestOrder,
  orderReference,
  restart,
  isGenerating,
  isOrdering,
} = useStorybook();

const PILL =
  "flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-base-500 bg-base-0 px-4 text-sm font-bold text-base-600 transition-colors hover:border-coral-500 peer-checked:border-coral-600 peer-checked:bg-coral-50 peer-checked:text-coral-700 peer-focus-visible:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)]";

/** Object URL of the chosen photo. Stays in the browser. */
const photoUrl = ref<string | null>(null);
watch(photoUrl, (url) => (draft.hasPhoto = Boolean(url)));

const hasAnswers = computed(() => Object.values(draft.answers).some((a) => a?.trim()));

const name = computed(() => draft.name.trim() || "your child");
const copy = computed(() => {
  const n = name.value;
  const map: Record<StepId, { title: string; lead?: string }> = {
    name: {
      title: "Who is the storybook about?",
      lead: "Enter the name or nickname of the main character.",
    },
    basics: {
      title: "Let's start with the basics",
      lead: `We'll use this to create a character that looks just like ${n}.`,
    },
    about: {
      title: `Tell us a bit about ${n}`,
      lead: "Answer a few questions to make the story more personal. All optional.",
    },
    photo: {
      title: `Make ${n} the star`,
      lead: `Upload a smiling, front-facing photo. We'll use it to draw a character that looks just like ${n}.`,
    },
    from: {
      title: "Who is this book from?",
      lead: `Let ${n} know who this gift is from. It will appear on the cover.`,
    },
    dedication: { title: "Add a dedication", lead: `Write a short, heartfelt note for ${n}.` },
    email: { title: "Last step! Where should we send the books?" },
    pick: {
      title: `${n}'s stories are ready`,
      lead: "Preview each one and pick the books you'd like to order.",
    },
  };
  return map[step.value];
});

const selectedBooks = computed(() => books.value.filter((b) => selected.value.includes(b.id)));

const headingEl = ref<HTMLElement | null>(null);
watch([step, orderReference], async () => {
  await nextTick();
  headingEl.value?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

async function onContinue() {
  try {
    await next();
  } catch (error) {
    push.error({
      title: "Something went wrong",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
}

async function onOrder() {
  try {
    await requestOrder();
  } catch (error) {
    push.error({
      title: "Couldn't send your request",
      message: error instanceof Error ? error.message : "Please try again.",
    });
  }
}

function startOver() {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value);
  photoUrl.value = null;
  restart();
}

onBeforeUnmount(() => {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value);
});
</script>
