import type { ApiResponse } from "./api-response";

/**
 * Apply at EVERY write call site. `status: false` arrives on an HTTP 200, so nothing in the fetch
 * layer throws for it — a call site that only asks "did a response come back?" would show a green
 * tick for a rejection. Throwing leaves each `catch` in charge of presentation.
 */
export function unwrapApiResponse<T>(
  res: ApiResponse<T> | undefined,
  fallback: string,
): ApiResponse<T> {
  if (!res) throw new Error(fallback); // the request never completed
  if (!res.status) throw new Error(res.message?.trim() || fallback);
  return res;
}
