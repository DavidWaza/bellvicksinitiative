import { photo } from "~/shared/photos";
import { sample } from "~/shared/sample-content";
import { TODO_CONTENT } from "~/shared/todo-content";
import type { Product, ShopPolicies } from "./shop-types";

/**
 * SAMPLE CATALOGUE: invented products, prices and descriptions so the shop's design can be
 * reviewed. Pictures are plain stock stand-ins (shared/photos.ts, credited on /credits): put the
 * real product photo at /images/shop/<slug>.jpg and list it in REAL_PHOTOS to replace one. Bellvicks hasn't supplied its real goods yet. Replace every `sample(...)` before
 * launch (`npm run build:launch` fails while any remain). Product slugs are also the page paths
 * (/shop/<slug>), which are prerendered from PRODUCT_SLUGS in shared/site-routes.ts: keep the two
 * lists in step.
 */
export const PRODUCTS: Product[] = sample([
  {
    slug: "give-hope-tshirt",
    name: "Give Hope T-shirt",
    category: "clothing",
    price: 12_000,
    summary: "Soft everyday tee with our Give Hope print.",
    description: [
      "A soft, everyday T-shirt printed with our Give Hope message. Wear it to events, on volunteer days, or just because.",
      "Every one sold helps fund our work with children and communities.",
    ],
    details: ["Cotton", "Unisex fit", "Machine washable"],
    image: photo("/images/shop/give-hope-tshirt.jpg", "shopTshirt", "Give Hope T-shirt"),
    colours: [
      { name: "White", hex: "#f4f2ee" },
      { name: "Forest", hex: "#1f5c43" },
      { name: "Sunset", hex: "#e07a12" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Bestseller",
  },
  {
    slug: "bellvicks-tote",
    name: "Bellvicks Tote Bag",
    category: "bags",
    price: 8_000,
    summary: "A sturdy canvas tote for books, market runs and more.",
    description: [
      "A roomy canvas tote with the Bellvicks logo. Strong enough for books, groceries and everything in between.",
    ],
    details: ["Canvas", "Long handles", "Inside pocket"],
    image: photo("/images/shop/bellvicks-tote.jpg", "shopTote", "Bellvicks Tote Bag"),
    colours: [
      { name: "Natural", hex: "#e6dccb" },
      { name: "Forest", hex: "#1f5c43" },
    ],
    badge: "New",
  },
  {
    slug: "kindness-hoodie",
    name: "Kindness Hoodie",
    category: "clothing",
    price: 22_000,
    summary: "A cosy hoodie for cool evenings and big hearts.",
    description: [
      "A warm, heavyweight hoodie with a small embroidered heart. Made for harmattan mornings and cool evenings.",
    ],
    details: ["Brushed fleece inside", "Kangaroo pocket", "Unisex fit"],
    image: photo("/images/shop/kindness-hoodie.jpg", "shopHoodie", "Kindness Hoodie"),
    colours: [
      { name: "White", hex: "#f4f2ee" },
      { name: "Charcoal", hex: "#3a3a3a" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "bellvicks-cap",
    name: "Bellvicks Cap",
    category: "clothing",
    price: 7_000,
    summary: "Keep the sun off on outreach days.",
    description: ["A classic cap with an embroidered Bellvicks logo and an adjustable strap."],
    details: ["One size", "Adjustable strap", "Embroidered logo"],
    image: photo("/images/shop/bellvicks-cap.jpg", "shopCap", "Bellvicks Cap"),
    colours: [
      { name: "White", hex: "#f4f2ee" },
      { name: "Navy", hex: "#23466e" },
    ],
  },
  {
    slug: "morning-hope-mug",
    name: "Morning Hope Mug",
    category: "home",
    price: 6_500,
    summary: "Start the day with tea, coffee and a little hope.",
    description: [
      "A generous ceramic mug with a hand-drawn Bellvicks design. A small daily reminder of the good you've done.",
    ],
    details: ["Ceramic", "Dishwasher safe", "Holds a large cup"],
    image: photo("/images/shop/morning-hope-mug.jpg", "shopMug", "Morning Hope Mug"),
    colours: [{ name: "White", hex: "#f4f2ee" }],
    badge: "Bestseller",
  },
  {
    slug: "dream-big-notebook",
    name: "Dream Big Notebook",
    category: "stationery",
    price: 4_500,
    summary: "A lined notebook for big ideas and small notes.",
    description: [
      "A hardback lined notebook with a Dream Big cover. Perfect for school, work or journalling.",
    ],
    details: ["A5", "Lined pages", "Hard cover"],
    image: photo("/images/shop/dream-big-notebook.jpg", "shopNotebook", "Dream Big Notebook"),
    colours: [{ name: "White", hex: "#f4f2ee" }],
  },
  {
    slug: "school-starter-set",
    name: "School Starter Set",
    category: "stationery",
    price: 9_000,
    summary: "Pencils, ruler, eraser and more in one pouch.",
    description: [
      "Everything a pupil needs to start the term: pencils, a ruler, an eraser, a sharpener and a zip pouch.",
    ],
    details: ["Zip pouch", "Pencils, ruler, eraser, sharpener"],
    image: photo("/images/shop/school-starter-set.jpg", "shopSchoolSet", "School Starter Set"),
    colours: [{ name: "Mixed", hex: "#e07a12" }],
    badge: "Limited",
  },
  {
    slug: "giving-gift-box",
    name: "Giving Gift Box",
    category: "gifts",
    price: 25_000,
    summary: "A mug, a notebook and a tote, wrapped and ready to give.",
    description: [
      "Our favourite things in one box: the Morning Hope Mug, the Dream Big Notebook and a Bellvicks Tote, gift-wrapped with a card for your message.",
    ],
    details: ["Gift-wrapped", "Includes a message card"],
    image: photo("/images/shop/giving-gift-box.jpg", "shopGiftBox", "Giving Gift Box"),
    colours: [{ name: "Kraft wrap", hex: "#b88a5a" }],
    badge: "New",
  },
] satisfies Product[]);

/** Not supplied yet: shown as "content needed" in dev, hidden in production. */
export const SHOP_POLICIES: ShopPolicies = {
  delivery: TODO_CONTENT,
  returns: TODO_CONTENT,
};

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
