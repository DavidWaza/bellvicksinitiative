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
import type {
  GenerateInput,
  StorybookMutationPort,
  StorybookServicePort,
} from "../ports/storybook.port";

/**
 * The storybook wizard use case: step machine, draft, generated books, AI covers and the pick.
 * Framework-agnostic (no router, no DOM). The photo is held as a Blob and only leaves the device
 * when AI covers are switched on (then it goes to our server to draw the covers, nowhere else).
 */
type CoverState = "idle" | "working" | "done" | "failed";
export default function useStorybookApp(options: {
  deps: {
    mutationPort: StorybookMutationPort;
    /** Emails the questionnaire + photo to the storybook team (fire and forget). */
    submitStorybook: StorybookServicePort["submitStorybook"];
  };
}) {
  const generateMutation = options.deps.mutationPort.useGenerateMutation();
  const illustrateMutation = options.deps.mutationPort.useIllustrateMutation();

  /** The child's photo (set by the photo step). */
  const photo = ref<Blob | null>(null);
  const coverState = ref<CoverState>("idle");
  const coverMessage = ref("");

  const draft = reactive<StoryDraft>(emptyDraft());
  const stepIndex = ref(0);
  const step = computed(() => STEPS[stepIndex.value]!);
  const canContinue = computed(() => canLeaveStep(step.value, draft));

  /** Steps the progress bar counts: everything before the books appear. */
  const formSteps = STEPS.length - 1;

  const books = ref<StoryBook[]>([]);
  const selected = ref<string[]>([]);

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
    if (step.value === "email") {
      await generate();
      goTo(stepIndex.value + 1);
      void illustrate(); // covers arrive while the customer reads the stories
      // The storybook team gets the details + photo. Never blocks or bothers the parent.
      void options.deps.submitStorybook(payload(), photo.value).catch(() => undefined);
      return;
    }
    goTo(stepIndex.value + 1);
  }

  /** Draws the AI covers from the photo and slots each one into its book. Never throws. */
  async function illustrate() {
    if (!photo.value || !books.value.length) return;
    coverState.value = "working";
    coverMessage.value = "";
    try {
      const res = await illustrateMutation.mutateAsync({ input: payload(), photo: photo.value });
      if (!res.status) {
        coverState.value = "failed";
        coverMessage.value = res.message ?? "";
        return;
      }
      const covers = res.data ?? [];
      if (!covers.length) {
        coverState.value = "idle"; // AI covers are switched off: the drawn covers stay
        return;
      }
      books.value = books.value.map((b) => ({
        ...b,
        coverUrl: covers.find((c) => c.id === b.id)?.coverUrl ?? b.coverUrl,
      }));
      coverState.value = "done";
    } catch {
      coverState.value = "failed";
      coverMessage.value =
        "We couldn't illustrate the covers just now. Your drawn covers are ready.";
    }
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

  function restart() {
    Object.assign(draft, emptyDraft());
    books.value = [];
    selected.value = [];
    photo.value = null;
    coverState.value = "idle";
    coverMessage.value = "";
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
    restart,
    photo,
    coverState,
    coverMessage,
    retryCovers: illustrate,
    isGenerating: generateMutation.isPending,
  };
}
