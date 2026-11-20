import { cva, type VariantProps } from "class-variance-authority";

export const sectionVariants = cva("relative w-full", {
  variants: {
    tone: {
      cream: "bg-base-50 text-base-900",
      white: "bg-base-0 text-base-900",
      mint: "bg-mint-50 text-base-900",
      lavender: "bg-lavender-50 text-base-900",
      sun: "bg-sun-50 text-base-900",
      forest: "bg-forest-900 text-base-50",
    },
    spacing: {
      none: "",
      sm: "py-10 md:py-14",
      default: "py-16 md:py-24",
    },
  },
  defaultVariants: { tone: "cream", spacing: "default" },
});

export type SectionVariants = VariantProps<typeof sectionVariants>;
