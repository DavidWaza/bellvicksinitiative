import type { CauseStatus, StatusEntry } from "./types";

/** Canonical status → label, icon and semantic tone. The one place a status gets its look. */
export const CAUSE_STATUS_REGISTRY: Record<CauseStatus, StatusEntry> = {
  active: { label: "Active", icon: "heart", tone: "info" },
  closing_soon: { label: "Closing soon", icon: "calendar", tone: "attention" },
  funded: { label: "Funded", icon: "check", tone: "success" },
  upcoming: { label: "Upcoming", icon: "calendar", tone: "neutral" },
};
