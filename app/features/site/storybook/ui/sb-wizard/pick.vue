<template>
  <div>
    <!-- AI cover progress -->
    <p
      v-if="coverState === 'working'"
      role="status"
      class="mx-auto mb-6 flex max-w-xl items-center justify-center gap-2 rounded-full bg-coral-50 px-5 py-3 text-center text-sm font-bold text-coral-700"
    >
      <NIcon name="spinner" class="animate-spin" />
      Illustrating {{ name }}'s covers… this takes about a minute.
    </p>
    <div
      v-else-if="coverState === 'failed'"
      role="status"
      class="mx-auto mb-6 flex max-w-xl flex-wrap items-center justify-center gap-3 rounded-2xl bg-base-100 px-5 py-3 text-center text-sm text-base-600"
    >
      {{ coverMessage || "We couldn't illustrate the covers just now." }}
      <NButton size="sm" variant="ghost" color="coral" @click="emit('retryCovers')"
        >Try again</NButton
      >
    </div>

    <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="book in books" :key="book.id" class="flex">
        <article
          :class="
            cn(
              'flex w-full flex-col overflow-hidden rounded-[2rem] bg-base-0 shadow-soft ring-2 transition-shadow',
              isSelected(book.id) ? 'ring-coral-500' : 'ring-transparent',
            )
          "
          :aria-labelledby="`sb-book-${book.id}`"
        >
          <div class="@container relative bg-base-100 p-6 pb-8">
            <!-- Skeleton while the AI cover is drawn; the cover fades in when it arrives -->
            <sb-wizard-book-cover
              :book="book"
              :from="from"
              :photo-url="photoUrl"
              :loading="coverState === 'working'"
            />
            <button
              type="button"
              :aria-label="`Preview ${book.title}`"
              class="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-base-0 text-base-900 shadow-soft hover:bg-base-50"
              @click="preview = book"
            >
              <NIcon name="search" />
            </button>
          </div>
          <div class="flex flex-1 flex-col gap-3 p-6">
            <p class="text-xs font-bold tracking-wide text-base-550 uppercase">
              {{ book.pages }} pages · {{ book.size }}
            </p>
            <h2
              :id="`sb-book-${book.id}`"
              class="font-display text-xl font-semibold text-forest-900"
            >
              {{ book.title }}
            </h2>
            <p class="text-base-600">{{ book.blurb }}</p>
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-xs font-bold text-base-550">Inspired by</span>
              <span
                v-for="reason in book.inspiredBy"
                :key="reason"
                class="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-bold text-coral-700"
                >{{ reason }}</span
              >
            </div>
            <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
              <NButton variant="ghost" color="brand" size="sm" @click="preview = book"
                >Preview</NButton
              >
              <NButton
                color="coral"
                size="sm"
                :variant="isSelected(book.id) ? 'solid' : 'ghost'"
                :aria-pressed="isSelected(book.id)"
                @click="emit('toggle', book.id)"
              >
                <NIcon :name="isSelected(book.id) ? 'check' : 'cart'" />
                {{ isSelected(book.id) ? "In cart" : "Add to cart" }}
              </NButton>
            </div>
          </div>
        </article>
      </li>
    </ul>

    <sb-wizard-preview-dialog
      :book="preview"
      :name="name"
      :from="from"
      :dedication="dedication"
      :photo-url="photoUrl"
      :cover-loading="coverState === 'working'"
      :selected="preview ? isSelected(preview.id) : false"
      @close="preview = null"
      @toggle="(id: string) => emit('toggle', id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { StoryBook } from "../../domain/storybook-types";

const props = defineProps<{
  books: StoryBook[];
  selected: string[];
  name: string;
  from: string;
  dedication: string;
  photoUrl: string | null;
  coverState: "idle" | "working" | "done" | "failed";
  coverMessage: string;
}>();
const emit = defineEmits<{ toggle: [id: string]; retryCovers: [] }>();

const preview = ref<StoryBook | null>(null);
const isSelected = (id: string) => props.selected.includes(id);
</script>
