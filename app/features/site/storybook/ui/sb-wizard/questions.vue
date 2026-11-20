<template>
  <div class="flex flex-col gap-3">
    <!-- Answered questions -->
    <div
      v-for="q in answered"
      :key="q.id"
      class="flex items-start gap-3 rounded-2xl border border-base-150 bg-base-0 p-4 shadow-soft"
    >
      <div class="min-w-0 flex-1">
        <p class="text-sm font-bold text-base-550">{{ questionText(q, name) }}</p>
        <p class="mt-1 break-words text-base-900">{{ model[q.id] }}</p>
      </div>
      <button
        type="button"
        :aria-label="`Edit answer: ${questionText(q, name)}`"
        class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-600 hover:bg-base-100"
        @click="openQuestion(q.id)"
      >
        <NIcon name="edit" />
      </button>
      <button
        type="button"
        :aria-label="`Remove answer: ${questionText(q, name)}`"
        class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-600 hover:bg-base-100"
        @click="remove(q.id)"
      >
        <NIcon name="trash" />
      </button>
    </div>

    <!-- Add another -->
    <button
      v-if="unanswered.length"
      ref="triggerEl"
      type="button"
      aria-haspopup="dialog"
      class="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-coral-150 bg-base-0 px-5 text-left font-medium text-base-900 transition-colors hover:border-coral-500"
      @click="openList"
    >
      {{ answered.length ? "Answer another question" : "Select a question to answer" }}
      <NIcon name="plusCircle" weight="fill" size="1.75rem" class="text-coral-500" />
    </button>

    <dialog
      ref="dialogEl"
      aria-labelledby="sb-q-title"
      class="sb-dialog m-auto w-[min(94vw,32rem)] max-w-none rounded-[2rem] bg-base-0 p-0 text-base-900 shadow-2xl"
      @click="onDialogClick"
      @close="active = null"
    >
      <div class="p-6 sm:p-7">
        <div class="flex items-center justify-between gap-3">
          <button
            v-if="active"
            type="button"
            class="-ml-2 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-2 text-sm text-base-600 hover:bg-base-100"
            @click="active = null"
          >
            <NIcon name="caretLeft" /> Choose another question
          </button>
          <h2 v-else id="sb-q-title" class="text-lg font-bold">Select a question</h2>
          <button
            type="button"
            aria-label="Close"
            class="flex size-11 cursor-pointer items-center justify-center rounded-full text-base-900 hover:bg-base-100"
            @click="close"
          >
            <span class="flex size-8 items-center justify-center rounded-full bg-base-100">
              <NIcon name="close" size="1rem" />
            </span>
          </button>
        </div>

        <!-- List -->
        <ul v-if="!active" role="list" class="mt-5 flex flex-col gap-3">
          <li v-for="q in unanswered" :key="q.id">
            <button
              type="button"
              class="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-base-500 px-5 py-3 text-left transition-colors hover:border-coral-500 hover:bg-coral-50"
              @click="openQuestion(q.id)"
            >
              {{ questionText(q, name) }}
              <NIcon
                name="plusCircle"
                weight="fill"
                size="1.6rem"
                class="shrink-0 text-coral-500"
              />
            </button>
          </li>
        </ul>

        <!-- Answer -->
        <form v-else class="mt-5" @submit.prevent="save">
          <label :for="`sb-a-${active.id}`" class="font-display block text-2xl font-semibold">
            <span id="sb-q-title">{{ questionText(active, name) }}</span>
          </label>
          <NTextarea
            :id="`sb-a-${active.id}`"
            ref="answerEl"
            v-model="draftAnswer"
            :rows="4"
            :maxlength="ANSWER_MAX"
            :placeholder="active.example"
            class="mt-4"
          />
          <p class="mt-1 text-right text-xs text-base-550">
            {{ draftAnswer.length }}/{{ ANSWER_MAX }}
          </p>
          <NButton
            type="submit"
            size="lg"
            color="coral"
            class="mt-4 w-full"
            :disabled="!draftAnswer.trim()"
            >Save answer</NButton
          >
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ANSWER_MAX,
  questionText,
  STORY_QUESTIONS,
  type QuestionId,
} from "../../domain/storybook-types";

/** Optional Q&A. A native <dialog> lists the unanswered questions, then shows one to answer. */
defineProps<{ name: string }>();
const model = defineModel<Partial<Record<QuestionId, string>>>({ required: true });

const dialogEl = ref<HTMLDialogElement | null>(null);
const triggerEl = ref<HTMLButtonElement | null>(null);
const answerEl = ref<{ $el: HTMLTextAreaElement } | null>(null);
const activeId = ref<QuestionId | null>(null);
const draftAnswer = ref("");

const active = computed({
  get: () => STORY_QUESTIONS.find((q) => q.id === activeId.value) ?? null,
  set: (v) => (activeId.value = v?.id ?? null),
});
const answered = computed(() => STORY_QUESTIONS.filter((q) => model.value[q.id]?.trim()));
const unanswered = computed(() => STORY_QUESTIONS.filter((q) => !model.value[q.id]?.trim()));

function openList() {
  activeId.value = null;
  dialogEl.value?.showModal();
}

async function openQuestion(id: QuestionId) {
  activeId.value = id;
  draftAnswer.value = model.value[id] ?? "";
  if (!dialogEl.value?.open) dialogEl.value?.showModal();
  await nextTick();
  answerEl.value?.$el.focus();
}

function save() {
  if (!activeId.value) return;
  model.value = { ...model.value, [activeId.value]: draftAnswer.value.trim() };
  close();
}

function remove(id: QuestionId) {
  const next = { ...model.value };
  delete next[id];
  model.value = next;
}

function close() {
  dialogEl.value?.close();
  triggerEl.value?.focus();
}

function onDialogClick(event: MouseEvent) {
  if (event.target === dialogEl.value) close();
}
</script>

<style scoped>
.sb-dialog::backdrop {
  background: rgb(29 26 21 / 0.5);
}
</style>
