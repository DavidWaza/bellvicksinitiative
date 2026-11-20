import type { StatusTone } from "./types";

export interface TonePalette {
  fg: string;
  bg: string;
  bd: string;
  /** Solid dot / bar colour */
  dot: string;
}

/** Tone → classes. Semantic ramps only (green/red/yellow) plus neutral base and informational sky. */
export const STATUS_TONE_PALETTE: Record<StatusTone, TonePalette> = {
  neutral: { fg: "text-base-550", bg: "bg-base-100", bd: "border-base-150", dot: "bg-base-400" },
  info: { fg: "text-sky-700", bg: "bg-sky-50", bd: "border-sky-150", dot: "bg-sky-500" },
  attention: {
    fg: "text-yellow-600",
    bg: "bg-yellow-50",
    bd: "border-yellow-150",
    dot: "bg-yellow-500",
  },
  success: { fg: "text-green-600", bg: "bg-green-50", bd: "border-green-150", dot: "bg-green-500" },
  danger: { fg: "text-red-600", bg: "bg-red-50", bd: "border-red-150", dot: "bg-red-500" },
};

export const STATUS_SIZES = {
  sm: "h-6 gap-1 px-2.5 text-xs",
  md: "h-7 gap-1.5 px-3 text-[0.8125rem]",
} as const;
export type StatusSize = keyof typeof STATUS_SIZES;
