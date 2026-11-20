import { DateTime } from "luxon";

import { APP_TIME_ZONE } from "./time-zone";

export { APP_TIME_ZONE };

/**
 * Reconciles the shapes a backend sends: a bare `YYYY-MM-DD` is a calendar date anchored in the
 * display zone; anything with an offset is honoured; a date-time without an offset is UTC.
 */
export function parseToLuxonDate(value: string | Date): DateTime {
  if (value instanceof Date) return DateTime.fromJSDate(value).setZone(APP_TIME_ZONE);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return DateTime.fromISO(value, { zone: APP_TIME_ZONE });
  const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  const parsed = hasOffset
    ? DateTime.fromISO(value, { setZone: true })
    : DateTime.fromISO(value, { zone: "utc" });
  return parsed.setZone(APP_TIME_ZONE);
}

/** e.g. "20 Nov 2026". Pass the raw timestamp down to the component that prints it. */
export function formatDisplayDate(value: string | Date): string {
  const dt = parseToLuxonDate(value);
  return dt.isValid ? dt.toFormat("d LLL yyyy") : "";
}

/** Machine-readable value for `<time datetime>`. */
export function toIsoDate(value: string | Date): string {
  const dt = parseToLuxonDate(value);
  return dt.isValid ? (dt.toISODate() ?? "") : "";
}
