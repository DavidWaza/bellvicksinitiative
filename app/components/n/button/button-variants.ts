import { cva, type VariantProps } from "class-variance-authority";

/**
 * `color` and `variant` are declared empty and resolved in compoundVariants, so they stay orthogonal
 * (ARCHITECTURE §4.1). Solid orange / coral carry DARK ink: white on accent-500 is only 2.45:1.
 */
export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,filter,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      color: { primary: "", brand: "", coral: "", light: "" },
      variant: { solid: "", ghost: "border", link: "" },
      size: {
        sm: "h-11 px-4 text-sm",
        default: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "size-11",
      },
    },
    compoundVariants: [
      // solid
      {
        color: "primary",
        variant: "solid",
        class: "bg-accent-500 text-base-950 shadow-soft hover:bg-accent-600",
      },
      {
        color: "brand",
        variant: "solid",
        class: "bg-forest-500 text-base-0 shadow-soft hover:bg-forest-600",
      },
      {
        color: "coral",
        variant: "solid",
        class: "bg-coral-500 text-base-950 shadow-soft hover:brightness-95",
      },
      {
        color: "light",
        variant: "solid",
        class: "bg-base-0 text-forest-500 hover:bg-base-100",
      },
      // ghost: quiet, outlined
      {
        color: "primary",
        variant: "ghost",
        class: "border-base-150 bg-base-0 text-base-900 hover:border-accent-500 hover:bg-accent-50",
      },
      {
        color: "brand",
        variant: "ghost",
        class:
          "border-base-150 bg-base-0 text-forest-500 hover:border-forest-500 hover:bg-forest-50",
      },
      {
        color: "coral",
        variant: "ghost",
        class: "border-coral-150 bg-base-0 text-coral-700 hover:border-coral-500 hover:bg-coral-50",
      },
      {
        color: "light",
        variant: "ghost",
        class: "border-base-0/50 bg-transparent text-base-0 hover:bg-base-0/10",
      },
      // link
      {
        variant: "link",
        class:
          "h-auto rounded-md px-0 underline decoration-2 underline-offset-4 hover:decoration-transparent",
      },
      { color: "primary", variant: "link", class: "text-accent-700" },
      { color: "brand", variant: "link", class: "text-forest-500" },
      { color: "coral", variant: "link", class: "text-coral-700" },
      { color: "light", variant: "link", class: "text-base-0" },
    ],
    defaultVariants: { color: "primary", variant: "solid", size: "default" },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
