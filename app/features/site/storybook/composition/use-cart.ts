import type { CartItem, StorybookPricing } from "../domain/cart-types";
import { MAX_CART_LINES, MAX_PHOTO_CHARS, MAX_QUANTITY } from "../domain/cart-types";

const STORAGE_KEY = "bv-storybook-cart";
/** AI covers are data URLs; keep only ones small enough for browser storage (~5 MB in total). */
const MAX_COVER_CHARS = 700_000;

let persisting = false;

/**
 * The cart: shared across pages with useState and remembered in this browser (localStorage).
 * It loads only after mount (`ready`), so the prerendered HTML and the first client render agree.
 */
export default function useCart() {
  const items = useState<CartItem[]>("sb-cart", () => []);
  const ready = useState("sb-cart-ready", () => false);
  const pub = useRuntimeConfig().public;
  // An empty setting means "not set" (-1), not 0 / free: same rule as server/utils/storybook-pricing.
  const amount = (v: unknown) =>
    v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? -1 : Number(v);
  const pricing: StorybookPricing = {
    bookPrice: amount(pub.storybookPriceNgn),
    deliveryNigeria: amount(pub.storybookDeliveryNigeriaNgn),
    deliveryInternational: amount(pub.storybookDeliveryInternationalNgn),
  };

  onMounted(() => {
    if (ready.value) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) items.value = saved.slice(0, MAX_CART_LINES);
    } catch {
      /* private mode or corrupt data: start empty */
    }
    ready.value = true;
    if (!persisting) {
      persisting = true;
      // A detached scope: the saver must outlive the page that first loaded the cart (a watcher
      // created in a component stops when it unmounts, and later changes were never saved).
      effectScope(true).run(() =>
        watch(
          items,
          (value) => {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            } catch {
              /* storage full or blocked: the cart still works for this visit */
            }
          },
          { deep: true },
        ),
      );
    }
  });

  const slimCover = (url?: string) => (url && url.length <= MAX_COVER_CHARS ? url : undefined);

  function add(item: Omit<CartItem, "key" | "quantity">): string {
    const key = `${item.bookId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    if (items.value.length < MAX_CART_LINES)
      items.value = [
        ...items.value,
        { ...item, coverUrl: slimCover(item.coverUrl), key, quantity: 1 },
      ];
    return key;
  }
  const remove = (key: string) => (items.value = items.value.filter((i) => i.key !== key));
  const setQuantity = (key: string, quantity: number) =>
    (items.value = items.value.map((i) =>
      i.key === key
        ? { ...i, quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity))) }
        : i,
    ));
  const setCover = (key: string, coverUrl?: string) =>
    (items.value = items.value.map((i) =>
      i.key === key ? { ...i, coverUrl: slimCover(coverUrl) } : i,
    ));
  /** The child's shrunk photo (utils/downscale-image), sent with the order at checkout. */
  const setPhoto = (key: string, photo: string | null) =>
    (items.value = items.value.map((i) =>
      i.key === key
        ? { ...i, photo: photo && photo.length <= MAX_PHOTO_CHARS ? photo : undefined }
        : i,
    ));
  const clear = () => (items.value = []);
  const count = computed(() => items.value.reduce((n, i) => n + i.quantity, 0));

  return { items, ready, pricing, count, add, remove, setQuantity, setCover, setPhoto, clear };
}
