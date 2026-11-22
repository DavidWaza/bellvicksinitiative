import type { StorybookPricing } from "../../app/features/site/storybook/domain/cart-types";

/** Prices from runtime config (NUXT_PUBLIC_STORYBOOK_*). The server's word is final. */
export function storybookPricing(): StorybookPricing {
  const pub = useRuntimeConfig().public;
  const n = (v: unknown) =>
    v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? -1 : Number(v);
  return {
    bookPrice: n(pub.storybookPriceNgn),
    deliveryNigeria: n(pub.storybookDeliveryNigeriaNgn),
    deliveryInternational: n(pub.storybookDeliveryInternationalNgn),
  };
}

export const apiFail = (message: string) => ({ status: false as const, message, data: null });
