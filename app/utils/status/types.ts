import type { IconName } from "~/utils/icons";

/** Canonical statuses, grouped by kind (ARCHITECTURE §5.1). Add a kind when a new domain needs one. */
export const CAUSE_STATUSES = ["active", "closing_soon", "funded", "upcoming"] as const;
export type CauseStatus = (typeof CAUSE_STATUSES)[number];

export type StatusKind = "cause";

export interface StatusKindMap {
  cause: CauseStatus;
}

export type StatusTone = "neutral" | "info" | "attention" | "success" | "danger";

export interface StatusEntry {
  label: string;
  icon: IconName;
  tone: StatusTone;
}
