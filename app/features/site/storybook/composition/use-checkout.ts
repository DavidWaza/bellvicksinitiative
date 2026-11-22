import { useCheckoutMutationAdapter } from "../adapters/checkout-mutation-adapter";
import useCheckoutApp from "../application/use-checkout-app";
import useCheckoutHttpAdapter from "../infrastructure/services/checkout-http-adapter";

/** Checkout talks to the site's own server, which talks to Paystack. */
export default function useCheckout() {
  return useCheckoutApp({
    deps: { mutationPort: useCheckoutMutationAdapter(useCheckoutHttpAdapter()) },
  });
}
