<template>
  <NSection id="causes" tone="cream" labelledby="causes-title" class="cv-auto scroll-mt-20">
    <NContainer>
      <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <NEyebrow v-reveal>Our causes</NEyebrow>
          <NHeading id="causes-title" v-reveal="1" class="mt-4 text-forest-900">
            Support a cause
            <NHeadingHighlight tone="accent">today</NHeadingHighlight>
          </NHeading>
        </div>
        <NButton :to="ROUTES.causes" variant="link" color="brand">
          View all causes <NIcon name="arrowRight" />
        </NButton>
      </div>

      <!-- Mobile: horizontal snap-scroll. md+: grid. -->
      <ul
        role="list"
        tabindex="0"
        aria-label="Causes"
        class="scrollbar-none -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
      >
        <li
          v-for="(cause, i) in causes"
          :key="cause.id"
          v-reveal="i"
          class="flex w-[82%] shrink-0 snap-center sm:w-[56%] md:w-auto"
        >
          <NCard class="w-full">
            <NCardMedia>
              <NBlobImage
                :src="cause.image.src"
                :alt="cause.image.alt"
                :consent="cause.image.consent"
                mask="none"
                sizes="xs:82vw sm:50vw md:25vw lg:280px"
                class="absolute inset-0"
              />
            </NCardMedia>

            <NCardBody>
              <div class="flex flex-wrap items-center gap-2">
                <NTodo :content="cause.status" label="Cause status">
                  <NStatus :status="String(cause.status)" />
                </NTodo>
                <span class="inline-flex items-center gap-1 text-sm font-medium text-base-550">
                  <NIcon name="pin" weight="duotone" class="text-forest-500" />
                  {{ cause.location }}
                </span>
                <NBadge v-if="cause.tag" tone="mint">{{ cause.tag }}</NBadge>
              </div>

              <h3 class="font-display text-xl leading-tight font-semibold text-forest-900">
                <NuxtLink :to="`${ROUTES.causes}/${cause.id}`" class="hover:underline">{{
                  cause.title
                }}</NuxtLink>
              </h3>
              <p class="text-sm text-base-550">{{ cause.summary }}</p>

              <div class="mt-auto pt-2">
                <NTodo :content="funding(cause)" label="Raised / goal" class="w-full">
                  <NProgress
                    v-if="isReal(cause.raised) && isReal(cause.goal)"
                    :raised="cause.raised"
                    :goal="cause.goal"
                    :currency="cause.currency"
                    :label="cause.title"
                  />
                  <template #placeholder>Raised — · Goal —</template>
                </NTodo>
              </div>
            </NCardBody>

            <NCardFooter>
              <NButton
                :to="`${ROUTES.donate}?cause=${cause.id}`"
                size="sm"
                class="w-full"
                :aria-label="`Donate to ${cause.title}`"
              >
                <NIcon name="heart" weight="fill" /> Donate
              </NButton>
            </NCardFooter>
          </NCard>
        </li>
      </ul>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { isReal, TODO_CONTENT } from "~/shared/todo-content";
import { ROUTES } from "~/shared/site-routes";
import type { HomeCause } from "../../domain/home-types";

defineProps<{ causes: HomeCause[] }>();

/** The bar needs both numbers; otherwise the funding slot is still "content needed". */
const funding = (cause: HomeCause) =>
  isReal(cause.raised) && isReal(cause.goal) ? true : TODO_CONTENT;
</script>
