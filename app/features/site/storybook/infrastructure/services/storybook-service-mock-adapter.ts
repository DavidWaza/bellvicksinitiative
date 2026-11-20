import { mockLatency, mockWrite } from "~/shared/mock";
import { okResponse } from "~/shared/response-helpers";
import type { StorybookServicePort } from "../../ports/storybook.port";
import { buildCoverPrompt } from "../mock/cover-prompts";
import { writeStories } from "../mock/story-templates";

/** Writing stories takes a moment in real life too; long enough to see the "writing" state. */
const GENERATE_LATENCY_MS = 2400;

/**
 * No backend yet: stories come from templates and covers are drawn stand-ins (no coverUrl).
 * Order requests are accepted and discarded. The real service generates 3 covers in Flick from
 * each book's coverPrompt + the child's photo and returns them as coverUrl.
 */
export default function useStorybookServiceMockAdapter(): StorybookServicePort {
  return {
    generateBooks: (input) =>
      mockLatency(
        okResponse(
          writeStories(input).map((book) => ({
            ...book,
            coverPrompt: buildCoverPrompt(input, book),
          })),
        ),
        GENERATE_LATENCY_MS,
      ),
    requestOrder: () =>
      mockWrite({ reference: `SB-${Math.random().toString(36).slice(2, 8).toUpperCase()}` }),
  };
}
