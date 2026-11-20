export const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR", "CAD"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = "NGN";

const formatters = new Map<string, Intl.NumberFormat>();

/**
 * The only place currency is formatted. Never format money at a call site.
 * `amount` is in major units (naira, not kobo). NGN is shown without decimals.
 */
export function formatMoney(amount: number, currency: Currency = DEFAULT_CURRENCY): string {
  const key = currency;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    formatters.set(key, fmt);
  }
  return fmt.format(amount);
}
