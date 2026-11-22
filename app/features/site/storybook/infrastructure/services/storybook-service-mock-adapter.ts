import { mockLatency } from "~/shared/mock";
import { okResponse } from "~/shared/response-helpers";
import type { StorybookServicePort } from "../../ports/storybook.port";
import { buildCoverPrompt } from "../mock/cover-prompts";
import { writeStories } from "../mock/story-templates";
import { illustrateCoversHttp } from "./cover-illustrator-http";
import { submitStorybookHttp } from "./storybook-submission-http";

/** Writing stories takes a moment in real life too; long enough to see the "writing" state. */
const GENERATE_LATENCY_MS = 2400;

/**
 * Stories come from the mock writer (no backend yet). Ordering is the cart + Paystack
 * checkout (composition/use-cart.ts, use-checkout.ts). Covers are REAL when AI covers are switched on: the site's own server draws them
 * with OpenAI (server/api/storybook/covers.post.ts). Otherwise the drawn stand-ins stay.
 */
export default function useStorybookServiceMockAdapter(): StorybookServicePort {
  const aiCovers = useAiCovers();
  const hasServer = !useRuntimeConfig().public.staticSite;
  return {
    submitStorybook: (input, photo) =>
      hasServer ? submitStorybookHttp(input, photo) : Promise.resolve(okResponse(null)),
    illustrateCovers: (input, photo) =>
      aiCovers ? illustrateCoversHttp(input, photo) : Promise.resolve(okResponse([])),
    generateBooks: (input) =>
      mockLatency(
        okResponse(
          writeStories(input).map(({ scene, ...book }) => ({
            ...book,
            coverPrompt: buildCoverPrompt(input, { title: book.title, scene }),
          })),
        ),
        GENERATE_LATENCY_MS,
      ),
  };
}
