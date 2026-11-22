<template>
  <dialog
    ref="dialogEl"
    aria-labelledby="sb-preview-title"
    class="sb-dialog m-auto max-h-[92dvh] w-[min(94vw,56rem)] max-w-none overflow-y-auto rounded-[2rem] bg-base-0 p-0 text-base-900 shadow-2xl"
    @click="onDialogClick"
    @close="emit('close')"
  >
    <div v-if="book" class="p-5 sm:p-7">
      <div class="flex items-center justify-between gap-3">
        <h2 id="sb-preview-title" class="font-display text-2xl font-semibold text-forest-900">
          {{ book.title }}
        </h2>
        <button
          type="button"
          aria-label="Close preview"
          class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-base-100"
          @click="dialogEl?.close()"
        >
          <span class="flex size-8 items-center justify-center rounded-full bg-base-100">
            <NIcon name="close" size="1rem" />
          </span>
        </button>
      </div>

      <!-- Spread: cover | dedication | first page -->
      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div class="@container">
          <sb-wizard-book-cover
            :book="book"
            :from="from"
            :photo-url="photoUrl"
            :loading="coverLoading"
          />
        </div>
        <div
          class="flex aspect-square flex-col items-center justify-center rounded-xl bg-base-50 p-6 text-center shadow-soft"
        >
          <p class="text-xs font-bold tracking-widest text-base-550 uppercase">Dedication</p>
          <p class="font-hand mt-3 text-2xl leading-snug whitespace-pre-line text-forest-900">
            {{ dedication }}
          </p>
        </div>
        <div
          class="flex aspect-square flex-col justify-center rounded-xl bg-base-50 p-6 shadow-soft"
        >
          <p class="text-xs font-bold tracking-widest text-base-550 uppercase">Page 1</p>
          <p class="font-display mt-3 text-lg leading-relaxed text-base-900">{{ book.opening }}</p>
        </div>
      </div>

      <p class="mt-5 text-sm text-base-550">
        The finished book is fully illustrated with {{ name.trim() || "your child" }} as the hero.
        {{ book.pages }} pages, {{ book.size }}.
      </p>

      <div class="mt-5 flex flex-wrap justify-end gap-3">
        <NButton variant="ghost" color="brand" @click="dialogEl?.close()">Close</NButton>
        <NButton
          color="coral"
          :variant="selected ? 'solid' : 'ghost'"
          :aria-pressed="selected"
          @click="emit('toggle', book.id)"
        >
          <NIcon :name="selected ? 'check' : 'cart'" />
          {{ selected ? "In cart" : "Add to cart" }}
        </NButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { StoryBook } from "../../domain/storybook-types";

const props = defineProps<{
  book: StoryBook | null;
  name: string;
  from: string;
  dedication: string;
  photoUrl: string | null;
  selected: boolean;
  /** The AI cover is still being drawn. */
  coverLoading?: boolean;
}>();
const emit = defineEmits<{ close: []; toggle: [id: string] }>();

const dialogEl = ref<HTMLDialogElement | null>(null);

// Native <dialog> + showModal(): focus trap, inert page and Esc for free. Focus returns to the
// button that opened it automatically.
watch(
  () => props.book,
  (book) => {
    if (book && !dialogEl.value?.open) dialogEl.value?.showModal();
    else if (!book && dialogEl.value?.open) dialogEl.value.close();
  },
);

function onDialogClick(event: MouseEvent) {
  if (event.target === dialogEl.value) dialogEl.value?.close();
}
</script>

<style scoped>
.sb-dialog::backdrop {
  background: rgb(29 26 21 / 0.5);
}
</style>
