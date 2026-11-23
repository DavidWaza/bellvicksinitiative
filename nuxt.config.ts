import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { NOINDEX_PATHS, PRERENDER_PATHS } from "./app/shared/site-routes";

const appDir = join(import.meta.dirname, "app");

// Every `features/**/ui` directory is registered as a component root (ARCHITECTURE §9.3).
// The glob runs once at config load — adding a new `ui/` directory needs a dev-server restart.
const uiDirs = globSync("features/**/ui", { cwd: appDir });

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL ?? "https://bellvicksinitiative.org";

/** Files still using invented demo values (shared/sample-content.ts). */
const sampleFiles = globSync("**/*.{ts,vue}", { cwd: appDir }).filter((f) =>
  readFileSync(join(appDir, f), "utf8").includes("~/shared/sample-content"),
);

export default defineNuxtConfig({
  hooks: {
    // Invented sample content: `npm run build` warns loudly; `npm run build:launch`
    // (STRICT_CONTENT=1) refuses to build, so the real launch can't ship invented facts.
    ready: (nuxt) => {
      if (nuxt.options.dev || nuxt.options._prepare || sampleFiles.length === 0) return;
      const list = `Sample (invented) content is still used in:\n  ${sampleFiles.join("\n  ")}\n`;
      if (process.env.STRICT_CONTENT === "1")
        throw new Error(`${list}Replace it with real content before the launch build.`);
      console.warn(
        `\n⚠  ${list}⚠  This build INCLUDES invented figures, quotes and names. Fine for previews; ` +
          "before going live, replace them and check with `npm run build:launch`.\n",
      );
    },
  },
  compatibilityDate: "2026-11-01",
  devServer: { port: 6300 },
  devtools: { enabled: true },

  modules: ["@nuxt/fonts", "@nuxt/image", "@nuxtjs/sitemap", "@nuxtjs/robots", "notivue/nuxt"],

  // Notivue's styles: without them its icons render huge and unpositioned.
  css: ["notivue/notification.css", "notivue/animations.css", "~/assets/css/tailwind.css"],

  vite: { plugins: [tailwindcss()] },

  components: [
    ...uiDirs.map((path) => ({
      path: `~/${path.replaceAll("\\", "/")}`,
      extensions: ["vue"],
    })),
    { path: "~/components", extensions: ["vue"], pathPrefix: false },
  ],
  imports: { dirs: ["features/**/composition"] },

  // Body + accent fonts. Fraunces (display) is self-hosted in public/fonts with its SOFT axis —
  // @nuxt/fonts cannot request that axis from Google. See tailwind.css.
  fonts: {
    families: [
      { name: "DM Sans", provider: "google", weights: [400, 500, 700], styles: ["normal"] },
      { name: "Caveat", provider: "google", weights: [500, 700], styles: ["normal"] },
    ],
    defaults: { subsets: ["latin"] },
  },

  image: {
    format: ["avif", "webp"],
    screens: { xs: 360, sm: 600, md: 960, lg: 1280, xl: 1536, "2xl": 1920 },
  },

  notivue: {
    position: "bottom-center",
    limit: 3,
    enqueue: true,
    notifications: {
      global: { duration: 5000 },
    },
  },

  site: { url: SITE_URL, name: "Bellvicks Initiative" },
  sitemap: {
    exclude: ["/_styleguide", ...NOINDEX_PATHS],
  },
  robots: {
    disallow: ["/_styleguide", ...NOINDEX_PATHS],
  },

  runtimeConfig: {
    // Storybook AI covers (server only). Off until NUXT_OPENAI_API_KEY is set; see server/api/storybook.
    openaiApiKey: "",
    // GPT Image 2.5 "Sunburst": the model the approved Flick samples were made with.
    openaiImageModel: "gpt-image-2.5-sunburst",
    /** Cover sets per visitor per day, and for the whole site per day (spending guard). */
    storybookCoversPerIp: 3,
    storybookCoversPerDay: 60,
    // Storybook checkout (server only): Paystack SECRET key. Off until set.
    paystackSecretKey: "",
    /** Paystack API address. Only changed for local testing against a stand-in server. */
    paystackApiBase: "https://api.paystack.co",
    // Form emails via Resend (server only). Storybook → storybookEmail; every other form →
    // contactEmail. The sender must be on a domain verified in Resend.
    resendApiKey: "",
    storybookEmail: "",
    contactEmail: "",
    emailFrom: "Bellvicks Initiative website <website@bellvicksinitiative.org>",
    public: {
      // Must match the server key being set (build AND runtime): it changes the photo consent text.
      storybookAiCovers: process.env.NUXT_PUBLIC_STORYBOOK_AI_COVERS === "1",
      // Storybook prices in naira. -1 = not set yet (checkout shows "price coming soon").
      // 0 delivery = free delivery. Read at build time too: rebuild after changing.
      storybookPriceNgn: -1,
      storybookDeliveryNigeriaNgn: -1,
      storybookDeliveryInternationalNgn: -1,
      /** "Your order will arrive within N days" (receipt email + confirmation page). */
      storybookDeliveryDays: 10,
      siteUrl: SITE_URL,
      // Set once a real 1200×630 social image exists, e.g. "/images/og/default.jpg".
      ogImage: process.env.NUXT_PUBLIC_OG_IMAGE ?? "/brand/og-image.png",
    },
  },

  // Hosted on Vercel: Nitro detects it and builds Vercel functions (preset "vercel"); Vercel
  // compresses responses itself. Prerendered pages are served from Vercel's CDN.

  routeRules: {
    ...Object.fromEntries(PRERENDER_PATHS.map((path) => [path, { prerender: true }])),
    "/_styleguide": { prerender: false, robots: false },
    // Old name of the storybook section.
    "/childrens-books": { redirect: { to: "/create-your-storybook", statusCode: 301 } },
  },

  typescript: { strict: true, typeCheck: false },
});
