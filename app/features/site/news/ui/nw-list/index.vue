<template>
  <div>
    <NPageHero :eyebrow="copy.eyebrow" :breadcrumbs="breadcrumbs">
      {{ copy.lead }} <NHeadingHighlight>{{ copy.highlight }}</NHeadingHighlight>
      <template #lead>{{ copy.intro }}</template>
      <template #actions>
        <NButton :to="kind === 'news' ? ROUTES.story : ROUTES.news" variant="ghost" color="brand">
          {{ kind === "news" ? "Read our stories" : "Latest news" }} <NIcon name="arrowRight" />
        </NButton>
      </template>
    </NPageHero>

    <NSection tone="white" :aria-label="copy.eyebrow">
      <NContainer>
        <ul v-if="hasPosts" role="list" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="post in posts" :key="post.id" class="flex">
            <NCard class="w-full">
              <article class="flex flex-1 flex-col">
                <NCardMedia>
                  <NBlobImage
                    :image="post.image"
                    mask="none"
                    sizes="xs:92vw sm:92vw md:33vw"
                    class="absolute inset-0"
                  />
                </NCardMedia>
                <NCardBody>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-550">
                    <NTodo :content="post.category" label="Category"
                      ><NBadge tone="sky">{{ post.category }}</NBadge></NTodo
                    >
                    <NTodo :content="post.publishedAt" label="Date">
                      <time :datetime="toIsoDate(String(post.publishedAt))">{{
                        formatDisplayDate(String(post.publishedAt))
                      }}</time>
                    </NTodo>
                  </div>
                  <h2 class="font-display text-xl leading-tight font-semibold text-forest-900">
                    <NTodo :content="post.title" label="Title" class="w-full">
                      {{ post.title }}
                      <template #placeholder>Post title</template>
                    </NTodo>
                  </h2>
                  <p class="text-sm text-base-550">
                    <NTodo :content="post.excerpt" label="Excerpt" class="w-full">
                      {{ post.excerpt }}
                      <template #placeholder>A short summary of the post.</template>
                    </NTodo>
                  </p>
                </NCardBody>
              </article>
            </NCard>
          </li>
        </ul>

        <NEmptyState
          v-else
          :icon="kind === 'news' ? 'news' : 'heart'"
          :tone="kind === 'news' ? 'sky' : 'coral'"
          :title="copy.emptyTitle"
        >
          {{ copy.emptyText }}
          <template #actions>
            <NButton to="#newsletter" color="brand">Get updates by email</NButton>
            <NButton :to="SITE_INFO.socials[0].href" variant="ghost" color="brand">
              <NIcon name="facebook" /> Follow on Facebook
            </NButton>
          </template>
        </NEmptyState>
      </NContainer>
    </NSection>
  </div>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";
import { formatDisplayDate, toIsoDate } from "~/utils/date-formatters";
import type { PostKind } from "../../domain/news-types";

const props = defineProps<{ kind: PostKind }>();
const { posts, hasPosts } = useNews(props.kind);

const COPY = {
  news: {
    eyebrow: "News",
    lead: "Updates from the",
    highlight: "field",
    intro: "News from our programmes, book drives and the communities we work with.",
    emptyTitle: "Our first updates are on the way",
    emptyText:
      "We're preparing news from our programmes. Sign up below and we'll send them straight to you.",
  },
  story: {
    eyebrow: "Stories",
    lead: "Small steps.",
    highlight: "Big dreams.",
    intro: "Stories from the children and families we work with, shared with their permission.",
    emptyTitle: "Stories coming soon",
    emptyText:
      "We only share a child's story with their guardian's consent. The first stories are being gathered now.",
  },
} as const;

const copy = computed(() => COPY[props.kind]);
const breadcrumbs = computed(() =>
  props.kind === "news"
    ? [{ label: "News" }]
    : [{ label: "News", to: ROUTES.news }, { label: "Stories" }],
);
</script>
