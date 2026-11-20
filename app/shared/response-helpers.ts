import type { ApiResponse } from "./api-response";

/** Success envelope. */
export function okResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { status: true, data, ...(message ? { message } : {}) };
}

/** Failure envelope — HTTP 200 with `status: false`, exactly like the real backend will send. */
export function failResponse<T>(data: T, message: string): ApiResponse<T> {
  return { status: false, data, message };
}

/**
 * Read-side guard (the mirror of `unwrapApiResponse`): returns the payload only when the envelope
 * says it succeeded, otherwise the fallback.
 */
export function readApiData<T>(response: ApiResponse<T> | undefined, fallback: T): T {
  if (!response?.status) return fallback;
  return response.data;
}
