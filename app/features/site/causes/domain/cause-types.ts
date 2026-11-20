import type { ImageSlot } from "~/shared/image";
import { isReal, type Content } from "~/shared/todo-content";
import type { CauseSlug, FocusAreaSlug } from "~/shared/site-routes";
import type { Currency } from "~/utils/format-money";
import type { CauseStatus } from "~/utils/status";

export type CauseLocation = "Keffi" | "Gwagwalada" | "Lokoja";

/** The causes slice's read model. The homepage keeps its own narrower copy (ARCHITECTURE §7). */
export interface Cause {
  slug: CauseSlug;
  title: string;
  location: CauseLocation;
  summary: string;
  /** Long description, one string per paragraph. */
  description: string[];
  /** What a gift goes towards — qualitative only, never invented amounts. */
  supports: string[];
  focusArea: FocusAreaSlug;
  tag?: string;
  status: Content<CauseStatus>;
  raised: Content<number>;
  goal: Content<number>;
  currency: Currency;
  image: ImageSlot;
}

export const CAUSE_LOCATIONS: CauseLocation[] = ["Keffi", "Gwagwalada", "Lokoja"];

/** True when both raised and goal are real numbers, so the progress bar can render. */
export function hasFunding(cause: Cause): cause is Cause & { raised: number; goal: number } {
  return isReal(cause.raised) && isReal(cause.goal);
}
