import { postForm } from "~/shared/form-post";
import type { InvolvedServicePort } from "../../ports/involved.port";

/** Emails applications to the contact inbox via our server (server/api/forms/[form].post.ts). */
export default function useInvolvedServiceHttpAdapter(): InvolvedServicePort {
  return {
    submitVolunteer: (input) => postForm("/api/forms/volunteer", input),
    submitMentor: (input) => postForm("/api/forms/mentor", input),
    submitPartner: (input) => postForm("/api/forms/partner", input),
  };
}
