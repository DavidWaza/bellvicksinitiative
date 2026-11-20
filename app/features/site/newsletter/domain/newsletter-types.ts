import * as yup from "yup";

export const newsletterSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Please enter your email address."),
});
export type NewsletterInput = yup.InferType<typeof newsletterSchema>;
