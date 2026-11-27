import { giftBySlug, type GiftItem } from "../domain/gift-items";
import { productBySlug } from "../domain/shop-products";
import {
  MAX_BAG_LINES,
  MAX_LINE_QUANTITY,
  type BagItem,
  type BagLine,
  type Product,
} from "../domain/shop-types";

const STORAGE_KEY = "bv-shop-bag";
let persisting = false;

/**
 * The shopping bag: shared across pages with useState and remembered in this browser
 * (localStorage). Loaded only after mount (`ready`), so prerendered HTML and the first client
 * render agree. Same pattern as the storybook cart (its saver runs in a detached effect scope so
 * it outlives the page that loaded it). Separate from the storybook cart on purpose: features
 * don't import each other.
 */
export default function useBag() {
  const lines = useState<BagLine[]>("gs-bag", () => []);
  const ready = useState("gs-bag-ready", () => false);

  onMounted(() => {
    if (ready.value) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved))
        lines.value = saved
          .filter((l) => (l?.kind === "gift" ? giftBySlug(l.slug) : productBySlug(l?.slug)))
          .slice(0, MAX_BAG_LINES);
    } catch {
      /* private mode or corrupt data: start empty */
    }
    ready.value = true;
    if (!persisting) {
      persisting = true;
      effectScope(true).run(() =>
        watch(
          lines,
          (value) => {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            } catch {
              /* storage full or blocked: the bag still works for this visit */
            }
          },
          { deep: true },
        ),
      );
    }
  });

  const clamp = (n: number) => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.round(n)));

  function add(product: Product, options: { colour?: string; size?: string; quantity?: number }) {
    const key = ["self", product.slug, options.colour ?? "", options.size ?? ""].join("|");
    put({ key, kind: "self", slug: product.slug, quantity: clamp(options.quantity ?? 1), colour: options.colour, size: options.size });
  }
  /** Give to a child: bought and donated, not for the buyer. */
  function addGift(gift: GiftItem, quantity = 1) {
    put({ key: `gift|${gift.slug}`, kind: "gift", slug: gift.slug, quantity: clamp(quantity) });
  }
  function put(line: BagLine) {
    const existing = lines.value.find((l) => l.key === line.key);
    if (existing) setQuantity(line.key, existing.quantity + line.quantity);
    else if (lines.value.length < MAX_BAG_LINES) lines.value = [...lines.value, line];
  }
  const remove = (key: string) => (lines.value = lines.value.filter((l) => l.key !== key));
  const setQuantity = (key: string, quantity: number) =>
    (lines.value = lines.value.map((l) => (l.key === key ? { ...l, quantity: clamp(quantity) } : l)));
  const clear = () => (lines.value = []);

  /** Lines with what they are, for display: products for yourself, gifts for a child. */
  const items = computed(() =>
    lines.value.flatMap((line): BagItem[] => {
      if (line.kind === "gift") {
        const gift = giftBySlug(line.slug);
        return gift
          ? [{ ...line, kind: "gift" as const, name: gift.name, price: gift.price, gift, product: undefined, total: gift.price * line.quantity }]
          : [];
      }
      const product = productBySlug(line.slug);
      return product
        ? [{ ...line, kind: "self" as const, name: product.name, price: product.price, product, gift: undefined, total: product.price * line.quantity }]
        : [];
    }),
  );
  const forYou = computed(() => items.value.filter((i) => i.kind === "self"));
  const gifts = computed(() => items.value.filter((i) => i.kind === "gift"));
  const count = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0));
  const subtotal = computed(() => items.value.reduce((n, i) => n + i.total, 0));

  return { lines, items, forYou, gifts, count, subtotal, ready, add, addGift, remove, setQuantity, clear };
}
