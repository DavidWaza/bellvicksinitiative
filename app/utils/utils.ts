import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** `twMerge(clsx(…))` — later classes win by Tailwind semantics. The one helper every component needs. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
