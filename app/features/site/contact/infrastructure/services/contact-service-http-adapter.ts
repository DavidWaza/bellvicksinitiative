import { postForm } from "~/shared/form-post";
import type { ContactServicePort } from "../../ports/contact.port";

/** Emails the message to the contact inbox via our server (server/api/forms/[form].post.ts). */
export default function useContactServiceHttpAdapter(): ContactServicePort {
  return { sendMessage: (input) => postForm("/api/forms/contact", input) };
}
