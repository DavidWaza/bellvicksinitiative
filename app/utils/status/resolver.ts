import { CAUSE_STATUSES, type CauseStatus } from "./types";

/**
 * Raw backend string → canonical status. When a backend invents a new spelling, add one alias line
 * and every screen updates. Without it the UI would read "Unknown".
 */
const CAUSE_STATUS_ALIASES: Record<string, CauseStatus> = {
  open: "active",
  live: "active",
  ongoing: "active",
  ending_soon: "closing_soon",
  almost_closed: "closing_soon",
  completed: "funded",
  fully_funded: "funded",
  coming_soon: "upcoming",
  planned: "upcoming",
};

function normalise(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function resolveCauseStatus(raw: string | undefined | null): CauseStatus {
  if (!raw) return "upcoming";
  const key = normalise(raw);
  if ((CAUSE_STATUSES as readonly string[]).includes(key)) return key as CauseStatus;
  return CAUSE_STATUS_ALIASES[key] ?? "upcoming";
}
