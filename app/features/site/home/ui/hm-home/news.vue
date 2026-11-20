<template>
  <NSection tone="cream" labelledby="news-title" class="cv-auto pt-4 md:pt-8">
    <NContainer>
      <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <NEyebrow v-reveal>Latest news &amp; stories</NEyebrow>
          <NHeading id="news-title" v-reveal="1" class="mt-4 text-forest-900">
            Updates from the
            <NHeadingHighlight tone="accent">field</NHeadingHighlight>
          </NHeading>
        </div>
        <NButton :to="ROUTES.news" variant="link" color="brand">
          View all news <NIcon name="arrowRight" />
        </NButton>
      </div>

      <ul role="list" class="mt-10 grid gap-5 md:grid-cols-3">
        <li v-for="(post, i) in posts" :key="post.id" v-reveal="i" class="flex">
          <NCard class="w-full">
            <article class="flex flex-1 flex-col">
              <NCardMedia>
                <NBlobImage
                  :src="post.image.src"
                  :alt="post.image.alt"
                  :consent="post.image.consent"
                  mask="none"
                  sizes="xs:100vw sm:100vw md:33vw"
                  class="absolute inset-0"
                />
              </NCardMedia>
              <NCardBody>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-550">
                  <NTodo :content="post.category" label="Category">
                    <NBadge tone="sky">{{ post.category }}</NBadge>
                  </NTodo>
                  <NTodo :content="post.publishedAt" label="Date">
                    <time :datetime="toIsoDate(String(post.publishedAt))">
                      {{ formatDisplayDate(String(post.publishedAt)) }}
                    </time>
                  </NTodo>
                </div>
                <h3 class="font-display text-xl leading-tight font-semibold text-forest-900">
                  <NTodo :content="post.title" label="Post title" class="w-full">
                    {{ post.title }}
                    <template #placeholder>Post title</template>
                  </NTodo>
                </h3>
                <NuxtLink
                  v-if="isReal(post.title)"
                  :to="ROUTES.news"
                  class="mt-auto inline-flex min-h-11 items-center gap-1.5 font-bold text-forest-500 underline decoration-2 underline-offset-4 hover:decoration-transparent"
                >
                  Read more <span class="sr-only">about {{ post.title }}</span>
                  <NIcon name="arrowRight" />
                </NuxtLink>
              </NCardBody>
            </article>
          </NCard>
        </li>
      </ul>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import { isReal } from "~/shared/todo-content";
import { formatDisplayDate, toIsoDate } from "~/utils/date-formatters";
import { ROUTES } from "~/shared/site-routes";
import type { HomeNewsPost } from "../../domain/home-types";

defineProps<{ posts: HomeNewsPost[] }>();
</script>
