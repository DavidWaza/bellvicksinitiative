<template>
  <NCard class="w-full">
    <NCardMedia>
      <NBlobImage
        :image="cause.image"
        mask="none"
        sizes="xs:92vw sm:92vw md:45vw lg:400px"
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
        <NuxtLink :to="causePath(cause.slug)" class="hover:underline">{{ cause.title }}</NuxtLink>
      </h3>
      <p class="text-sm text-base-550">{{ cause.summary }}</p>
      <div class="mt-auto pt-2">
        <NProgress
          v-if="hasFunding(cause)"
          :raised="cause.raised"
          :goal="cause.goal"
          :currency="cause.currency"
          :label="cause.title"
        />
        <NTodo v-else :content="TODO_CONTENT" label="Raised / goal" class="w-full">
          <template #placeholder>Raised — · Goal —</template>
        </NTodo>
      </div>
    </NCardBody>
    <NCardFooter class="flex-wrap">
      <NButton :to="`${ROUTES.donate}?cause=${cause.slug}`" size="sm" class="flex-1">
        <NIcon name="heart" weight="fill" /> Donate
        <span class="sr-only">to {{ cause.title }}</span>
      </NButton>
      <NButton :to="causePath(cause.slug)" size="sm" variant="ghost" color="brand" class="flex-1">
        Details <span class="sr-only">about {{ cause.title }}</span>
      </NButton>
    </NCardFooter>
  </NCard>
</template>

<script setup lang="ts">
import { causePath, ROUTES } from "~/shared/site-routes";
import { TODO_CONTENT } from "~/shared/todo-content";
import { hasFunding, type Cause } from "../../domain/cause-types";

defineProps<{ cause: Cause }>();
</script>
