import { postForm } from "~/shared/form-post";
import type { DonateServicePort } from "../../ports/donate.port";

/** Emails the pledge to the contact inbox via our server. A pledge, never a payment. */
export default function useDonateServiceHttpAdapter(): DonateServicePort {
  return { pledge: (input) => postForm("/api/forms/pledge", input) };
}
