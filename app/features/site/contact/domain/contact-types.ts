import * as yup from "yup";

export const CONTACT_TOPICS = [
  { value: "general", label: "General enquiry" },
  { value: "donation", label: "Donations and giving" },
  { value: "books", label: "Donating books" },
  { value: "volunteering", label: "Volunteering" },
  { value: "partnership", label: "Partnerships" },
  { value: "media", label: "Media" },
];

export const contactSchema = yup.object({
  name: yup.string().trim().required("Please tell us your name."),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Please enter your email."),
  topic: yup.string().required("Choose a topic."),
  message: yup
    .string()
    .trim()
    .min(10, "Please write a little more (at least 10 characters).")
    .max(3000)
    .required("Please write your message."),
});
export type ContactMessage = yup.InferType<typeof contactSchema>;
