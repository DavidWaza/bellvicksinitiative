import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { PRERENDER_PATHS } from "./app/shared/site-routes";

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

  css: ["~/assets/css/tailwind.css"],

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
    exclude: ["/_styleguide"],
  },
  robots: {
    disallow: ["/_styleguide"],
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      // Set once a real 1200×630 social image exists, e.g. "/images/og/default.jpg".
      ogImage: process.env.NUXT_PUBLIC_OG_IMAGE ?? "/brand/og-image.png",
    },
  },

  // Serve prerendered HTML/JS/CSS pre-compressed (br + gzip).
  nitro: { compressPublicAssets: true },

  routeRules: {
    ...Object.fromEntries(PRERENDER_PATHS.map((path) => [path, { prerender: true }])),
    "/_styleguide": { prerender: false, robots: false },
    // Old name of the storybook section.
    "/childrens-books": { redirect: { to: "/create-your-storybook", statusCode: 301 } },
  },

  typescript: { strict: true, typeCheck: false },
});
