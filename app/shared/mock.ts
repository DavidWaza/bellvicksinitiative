import type { ApiResponse } from "./api-response";
import { okResponse } from "./response-helpers";

/** Fake latency so loading states render at least once (ARCHITECTURE §9.1). */
export const MOCK_LIST_LATENCY_MS = 400;

/**
 * Resolves `value` after `ms`. On the server the delay is skipped: SSR must not hold a prerender
 * for a fake wait, and hydrated data never shows a loading state anyway. Client navigations and
 * mutations still get the full delay.
 */
export async function mockLatency<T>(value: T, ms: number): Promise<T> {
  if (import.meta.client) await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}

/** A mock read answering with the success envelope after list latency. */
export function mockRead<T>(data: T): Promise<ApiResponse<T>> {
  return mockLatency(okResponse(data), MOCK_LIST_LATENCY_MS);
}
