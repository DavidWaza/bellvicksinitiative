import type { ImageSlot } from "~/shared/image";
import type { GiftItem } from "./gift-items";
import type { Content } from "~/shared/todo-content";
import type { IconName } from "~/utils/icons";

/**
 * THE GIVING SHOP: Bellvicks' online store. EVERY item is donated by a person or organisation,
 * and the proceeds are used for humanitarian purposes (Bellvicks' own statement; say it boldly). FRONTEND ONLY for now: the catalogue is sample content (see shop-products.ts) and there is
 * no checkout yet. Never fake a payment step: the bag says checkout is coming.
 */
export const SHOP_NAME = "The Giving Shop";
export const SHOP_TAGLINE = "Shop with purpose";

export type ShopCategory = "clothing" | "bags" | "home" | "stationery" | "gifts";

export const SHOP_CATEGORIES: { value: ShopCategory; label: string; icon: IconName }[] = [
  { value: "clothing", label: "Clothing", icon: "tshirt" },
  { value: "bags", label: "Bags", icon: "tote" },
  { value: "home", label: "Home", icon: "mug" },
  { value: "stationery", label: "Stationery", icon: "stationery" },
  { value: "gifts", label: "Gifts", icon: "gift" },
];

export interface ProductColour {
  name: string;
  /** Swatch colour. */
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  category: ShopCategory;
  /** Naira. */
  price: number;
  /** One line for the card. */
  summary: string;
  /** Paragraphs for the product page. */
  description: string[];
  /** Short bullet facts ("100% cotton"). */
  details: string[];
  /** Product photo slot (shared/photos.ts): a stock stand-in until the real photo exists. */
  image: ImageSlot;
  colours: ProductColour[];
  /** Clothing sizes, if any. */
  sizes?: string[];
  badge?: "New" | "Bestseller" | "Limited";
}

/** Delivery and returns policies: not supplied yet. */
export interface ShopPolicies {
  delivery: Content<string>;
  returns: Content<string>;
}

export interface BagLine {
  /** kind + slug + options, so the same product in two sizes is two lines. */
  key: string;
  /** "self": bought for yourself. "gift": bought and donated to a child (Give to a child). */
  kind?: "self" | "gift";
  slug: string;
  quantity: number;
  colour?: string;
  size?: string;
}

/** A bag line with what it is, for display. */
export interface BagItem {
  key: string;
  slug: string;
  kind: "self" | "gift";
  name: string;
  price: number;
  quantity: number;
  total: number;
  colour?: string;
  size?: string;
  product?: Product;
  gift?: GiftItem;
}

export const MAX_BAG_LINES = 30;
export const MAX_LINE_QUANTITY = 20;

export type ShopSort = "featured" | "price-asc" | "price-desc" | "name";
export const SHOP_SORTS: { value: ShopSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

export function sortProducts(list: Product[], sort: ShopSort): Product[] {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy;
}
