import { computed, reactive, ref } from "vue";
import { unwrapApiResponse } from "~/shared/api-envelope";
import {
  canLeaveStep,
  defaultDedication,
  emptyDraft,
  STEPS,
  type StoryBook,
  type StoryDraft,
} from "../domain/storybook-types";
import type { GenerateInput, StorybookMutationPort } from "../ports/storybook.port";

/**
 * The storybook wizard use case: step machine, draft, generated books and the customer's pick.
 * Framework-agnostic (no router, no DOM). The photo itself is a UI concern and never leaves the
 * device in this version; the draft only records that one was chosen.
 */
export default function useStorybookApp(options: {
  deps: { mutationPort: StorybookMutationPort };
}) {
  const generateMutation = options.deps.mutationPort.useGenerateMutation();
  const orderMutation = options.deps.mutationPort.useOrderMutation();

  const draft = reactive<StoryDraft>(emptyDraft());
  const stepIndex = ref(0);
  const step = computed(() => STEPS[stepIndex.value]!);
  const canContinue = computed(() => canLeaveStep(step.value, draft));

  /** Steps the progress bar counts: everything before the books appear. */
  const formSteps = STEPS.length - 1;

  const books = ref<StoryBook[]>([]);
  const selected = ref<string[]>([]);
  const orderReference = ref<string | null>(null);

  /** What leaves the browser: everything except the photo flag. */
  const payload = (): GenerateInput => ({
    name: draft.name,
    gender: draft.gender,
    age: draft.age,
    answers: { ...draft.answers },
    eyeColour: draft.eyeColour,
    guardianConsent: draft.guardianConsent,
    from: draft.from,
    dedication: draft.dedication,
    email: draft.email,
  });

  function goTo(index: number) {
    stepIndex.value = Math.max(0, Math.min(STEPS.length - 1, index));
    // Prefill the dedication the first time it's shown; the customer can rewrite it.
    if (step.value === "dedication" && !draft.dedication.trim())
      draft.dedication = defaultDedication(draft.name.trim(), draft.from.trim());
  }

  /** Advances one step. On the email step this writes the books first. */
  async function next() {
    if (!canContinue.value) return;
    if (step.value === "email") await generate();
    goTo(stepIndex.value + 1);
  }

  const back = () => goTo(stepIndex.value - 1);

  async function generate() {
    const res = await generateMutation.mutateAsync(payload());
    books.value =
      unwrapApiResponse(res, "We couldn't write the stories just now. Please try again.").data ??
      [];
    selected.value = [];
  }

  function toggleBook(id: string) {
    selected.value = selected.value.includes(id)
      ? selected.value.filter((b) => b !== id)
      : [...selected.value, id];
  }

  async function requestOrder() {
    if (!selected.value.length) return;
    const res = await orderMutation.mutateAsync({ draft: payload(), bookIds: selected.value });
    const data = unwrapApiResponse(
      res,
      "We couldn't send your request just now. Please try again.",
    ).data;
    orderReference.value = data?.reference ?? null;
  }

  function restart() {
    Object.assign(draft, emptyDraft());
    books.value = [];
    selected.value = [];
    orderReference.value = null;
    goTo(0);
  }

  return {
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
    isGenerating: generateMutation.isPending,
    isOrdering: orderMutation.isPending,
  };
}
