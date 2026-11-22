# AGENTS.md: Bellvicks Initiative website

Rules for anyone (human or agent) working in this repo. `ARCHITECTURE.md` is the blueprint;
this file records how and why this project departs from it, and the things that surprised us.
`docs/index.md` is the component catalogue. Don't start a second one.

## Commands

```bash
npm run dev          # http://localhost:6300
npm run format:fix   # oxfmt app
npm run lint         # oxlint app
npm run typecheck    # nuxt typecheck (vue-tsc)
npm run knip         # unused files / exports / deps
npm run build        # production build + prerender (~30s here)
npm run build:launch # same, but FAILS while invented sample content remains (run before going live)
node .output/server/index.mjs   # run a local production build (PORT=6301 to pick a port)
node scripts/contrast-report.mjs   # regenerate docs/design/contrast.md
node scripts/generate-dot-map.mjs  # regenerate the dotted world-map path
node scripts/generate-icons.mjs    # regenerate app/utils/icon-paths.ts after adding an icon
node scripts/generate-logo.mjs     # regenerate public/brand/* + favicon.ico from brand/logo-source.jpg
node scripts/generate-partner-logos.mjs  # trim/re-ink brand/partners/* into public/partners/
```

**The loop is `oxfmt` → `oxlint` → `typecheck`, then `knip`.** There is no test suite, on purpose
(ARCHITECTURE §14). Behaviour is verified by a person in the browser.

## Adaptations from ARCHITECTURE.md (it was written for an internal dashboard)

1. **No Vuetify.** Reka UI provides the headless primitives (NavigationMenu, Dialog, Accordion,
   Progress). There is no layers.css or settings.scss, and the breakpoints are defined once, in
   `tailwind.css`: `sm 600 · md 960 · lg 1280 · xl 1536 · 2xl 1920`.
2. **One data layer: `app/features/` slices.** No `app/infra/`. Shared envelope and response
   helpers, `TODO_CONTENT`, the image type, and `ROUTES`/`SITE_INFO` live in `app/shared/`.
3. **Real SSR.** TanStack Query is dehydrated on the server and hydrated on the client
   (`plugins/vue-query.ts`). Composition roots prefetch with `onServerPrefetch(suspense)`.
   **No `<client-only>` around content.** Every public route is prerendered via `routeRules`
   (the list comes from `shared/site-routes.ts`).
4. **No auth yet.** A donor dashboard is planned. When it comes, follow ARCHITECTURE §11 exactly,
   and keep step 1: `sitemap.xml` and `robots.txt` must stay outside the gate.
5. **No backend yet.** Every slice talks to a mock adapter that returns the `ApiResponse<T>`
   envelope with faked latency (400ms reads, 650ms writes, skipped during SSR). **Swap point:**
   one line in `features/site/home/composition/use-home-deps.ts`.
6. **No dev mock-auth back door, ever.**
7. **Dates:** Luxon in `Africa/Lagos` (`utils/date-formatters.ts`). **Money:**
   `formatMoney(amount, currency)` only, defaulting to NGN. Never format currency at a call site.

## The `TODO_CONTENT` convention

Bellvicks hasn't supplied impact figures, cause amounts or status, stories, testimonials, news,
team names, its registration (CAC) number or book titles. **Never invent them.**

- Content fields are typed `Content<T> = T | TODO_CONTENT` (`shared/todo-content.ts`). All homepage
  copy lives in one typed module: `features/site/home/infrastructure/mock/home-content.ts`.
- Render through `<NTodo :content="x" label="…">`. In dev that's a dashed outline with a
  "content needed" tag; in production it's the `fallback` slot (default: nothing).
- Whole sections that would only show placeholders (impact, story, news, testimonials) are hidden
  in production by `domain/home-sections.ts` (`resolveHomeVisibility`). **Hide sections there, in
  the application layer, not with ad-hoc `v-if`s in templates.**
- **Photos:** every image is a slot resolved by `photo(slot, stockKey, alt)` in
  `shared/photos.ts`. Until a real Bellvicks photo exists, the slot shows a **free Unsplash stock
  stand-in** (`public/images/stock/`, credited on `/credits`). To use a real photo, put the file at
  the slot path and add it to `REAL_PHOTOS` with its consent state; the stock image drops out.
  **Every child photo needs guardian consent.** `NBlobImage` won't render a `consent: "pending"`
  photo in production.
- **Stock photos are illustrative only.** Never caption one as a named or real beneficiary, and
  never put a stock face next to a testimonial or story. Story and testimonial slots pass `null`
  (no stock) on purpose.

- **Sample content (temporary).** For demos, the slots above are currently filled with INVENTED
  values wrapped in `sample(...)` (`shared/sample-content.ts`): impact figures, cause funding and
  status, book titles, the story, news posts, testimonials and team names. `grep "sample("` lists
  them all. `npm run build` prints a loud warning listing them (the `ready` hook in `nuxt.config.ts`);
  **`npm run build:launch` fails while any remain**, so run it before going live. The CAC number is never sampled.

- **Form emails (Resend).** Every form posts to our server, which emails it (`server/utils/email.ts`):
  storybook questionnaires (with the photo attached, `server/api/storybook/submission.post.ts`)
  and paid orders (`checkout/verify.get.ts`, once per reference) → `NUXT_STORYBOOK_EMAIL`;
  contact, volunteer, mentor, partner, pledge, newsletter and the homepage sign-up
  (`server/api/forms/[form].post.ts`, validated with the same yup schemas) →
  `NUXT_CONTACT_EMAIL`. Reply-To is the visitor. Browser side: `shared/form-post.ts`, which never
  pretends: if the server can't be reached it fails with "please email us at …". **Production
  doesn't read `.env`**: set these in Vercel → Settings → Environment Variables.
- **Paid storybook orders email the storybook inbox ONCE, complete** (`server/utils/storybook-order.ts`):
  totals, delivery, and per book the child's form details (gender, eyes, from, dedication, every
  answer, "inspired by") with each child's photo attached. The cart keeps a shrunk photo per book
  (`utils/downscale-image.ts`, ~100 KB); checkout hands the photos to `holdOrderPhotos` (shared store, 24h)
  because Paystack metadata can't carry images. Sent by whichever comes first: `/checkout/complete`
  (verify) or the **Paystack webhook** `/api/paystack/webhook` (HMAC-SHA512 signature checked;
  covers customers who close the tab). Both send in the background (`event.waitUntil`).
  `NUXT_PAYSTACK_API_BASE` exists only to test against a local stand-in Paystack.
- **Never read `window.location.search` on a prerendered page's first mount.** While it hydrates,
  the router briefly replaces the address without its query string. `/checkout/complete` read it
  then, found no `?reference`, and no payment could ever be confirmed. Use `useRoute().query`.

## Hosting: Vercel

- **Vercel builds with `npm run build`** and Nitro's `vercel` preset (detected automatically):
  prerendered pages go to the CDN, `server/api/*` become Vercel functions. No `vercel.json` needed.
- **Environment variables** go in Vercel → Settings → Environment Variables (see `.env.example`).
  `NUXT_PUBLIC_*` are read at BUILD time (prices, AI covers switch): redeploy after changing them.
- **Functions don't share memory** (each request may run in a different instance). Anything the
  server must remember between requests (order photos, "order already emailed", spam and spending
  limits) goes through `server/utils/kv.ts` → **Upstash Redis** (Vercel → Storage; sets
  `KV_REST_API_URL`/`KV_REST_API_TOKEN`). Locally it falls back to memory. A startup warning in
  the Vercel logs (`server/plugins/check-store.ts`) says if it's missing. Never add a module-level
  `Map`/`Set` as server state.
- **4.5 MB request limit.** Photos are shrunk in the browser before upload
  (`shrinkPhotoForUpload`, ~1600px JPEG) and checkout sends each child's photo once.
- **Function time:** 300s by default (Fluid compute), enough for AI covers. Slow work after the
  response (order emails) uses `event.waitUntil`.
- **Paystack webhook:** `https://<domain>/api/paystack/webhook` in the Paystack dashboard.

## Things that surprised us (read before changing them)

- **`--color-*: initial`.** Stock Tailwind colours render nothing, with no warning. Only the ramps
  in `tailwind.css` exist. `accent-700`, `coral-700` and `sky-700` were added because the brief's
  600 steps fail 4.5:1 for small text. See `docs/design/contrast.md` and re-run its script after
  any token change.
- **White on orange fails (2.45:1).** Solid orange and coral buttons carry dark ink.
- **A new `ui/` directory needs a dev-server restart.** The glob in `nuxt.config.ts` runs once.
- **`~/components` uses `pathPrefix: false`.** `n/badge/NSticker.vue` is `<NSticker>`, not
  `<NBadgeNSticker>`.
- **`NSheet` (Reka `DialogRoot`) renders no element,** so a `class` on it is silently dropped.
  Wrap it in a `div` to hide it at a breakpoint.
- **Scroll-reveal runs from an inline `<head>` script** (`utils/reveal-script.ts`), not from Vue.
  An earlier version revealed content only after its section hydrated; with lazily hydrated
  sections that left **blank sections on slow devices**. The head script observes every
  `[data-reveal]` / `[data-draw]` element from first paint; the `v-reveal` directive only hands
  client-created elements to the same observer (`window.__bvReveal`). Verified: with every JS
  bundle blocked, nothing stays hidden.
- **The header uses no component library.** Desktop dropdowns follow the WAI-ARIA *disclosure*
  pattern (`desktop-nav.vue`): a button with `aria-expanded` and a `v-show` panel of plain links.
  Hover opens with a mouse; a click on a hover-opened panel *pins* it (a naive toggle closed it,
  because the hover had already opened it); Esc, focus-out, outside click and route change close
  it. The mobile menu is a native `<dialog>` (`showModal()` gives the focus trap, inert background
  and Esc) with `<details>` accordions. Reka remains only for the volunteer sheet and progress bar.
- **Icons are generated SVG strings, not `@phosphor-icons/vue`.** Each Phosphor Vue component
  bundles all six weights as render code (216KB of startup JS for ~60 icons). Add an icon in
  `scripts/generate-icons.mjs` (`ICON_SOURCES`) and re-run it; `fill` is generated only for icons
  a template uses with `weight="fill"` (others fall back to regular).
- **Import `APP_TIME_ZONE` from `utils/time-zone`**, not `utils/date-formatters`: the latter pulls
  all of Luxon into whichever bundle imports it.
- **`v-reveal` uses data attributes, not classes.** A class added by `getSSRProps` caused a
  hydration mismatch on every revealed element. Content is only ever hidden under `.motion-ok`,
  which the head script adds when the user hasn't asked for reduced motion.
- **Don't put `v-reveal` above the fold.** Hiding the hero until JS ran made LCP 7.9s; without it
  LCP is 0.9s.
- **Lazy hydration (`<LazyX hydrate-on-visible>`) is used for every homepage section below the
  values cards.** Two traps were found and fixed:
  - `useId()` in a lazily hydrated component yields a different id on the client from the
    server's, which broke a label's `for`. Use static ids there (see `newsletter.vue`). `NField`
    uses `useId()`, so only use it in eagerly hydrated or client-only (sheet) content.
  - **`hydrate-on-interaction` breaks Reka menus.** The first hover or tap only hydrates; the
    mega menu and mobile sheet didn't open. The header hydrates normally.
- **The dotted world map (`NDotMap`) must stay inline SVG on its own layer**
  (`will-change-transform`). The 948-dot path was being repainted by the animations above it,
  which dominated TBT. As an `<img>` it became the LCP element (4.9s). The "floating" hero dots
  are static for the same reason. Only the Abuja pin pulses.
- **`cv-auto` (`content-visibility: auto`) on below-the-fold sections** skips their layout until
  they're near the viewport. Don't use it on anything that paints outside its own box (the
  footer's leafy edge sits above the footer, so the footer doesn't use it).
- **Fraunces is self-hosted from `public/fonts/`** (SOFT and opsz axes; @nuxt/fonts can't request
  SOFT from Google) and preloaded in `app.vue`. DM Sans and Caveat come from @nuxt/fonts. OFL
  licence: `public/fonts/FRAUNCES-OFL.txt`.
- **npm needs `legacy-peer-deps`** (`.npmrc`): `@tanstack/vue-query` declares an optional peer on
  the Vue 2 composition-api shim.
- `status: false` arrives on HTTP 200. Every write goes through `unwrapApiResponse`.

- **`@nuxt/image` `sizes` syntax is not CSS.** Write `"xs:92vw sm:92vw md:45vw lg:560px"`. CSS
  media-query syntax, or an unprefixed `92vw`, resolves against a 1px screen and ships 1px images.
  Multiple formats need `<NuxtPicture>` (`NBlobImage` uses it); `<NuxtImg format="avif,webp">`
  generates an invalid URL.
- **Full-page screenshots blank out `cv-auto` sections** (`content-visibility` skips off-screen
  paint). Real visitors see them as they scroll. For documentation screenshots, inject
  `.cv-auto{content-visibility:visible!important}` first.
- **Measure performance on PageSpeed Insights, not this laptop.** Local Lighthouse varies wildly
  here (the same build ranged from TBT 242ms to 1,043ms). Under 4× CPU throttle the homepage now
  spends only ~0.3s in script; most remaining main-thread time is rendering (images, clip-path
  masks, dot map, shadows, header blur). If PSI on the deployed site is under 90, start there.

## Slices

| Slice | Prefix | Notes |
| --- | --- | --- |
| `features/site/shell` | `sh-` | Header (mega menu, mobile sheet), footer, floating Donate. Domain only. No server data. |
| `features/site/home` | `hm-` | Homepage. Domain, ports, adapters, application, composition, mock infrastructure, `ui/hm-home/`. Causes and books here are this slice's own narrow read models. |
| `features/site/newsletter` | `nl-` | **The one shared slice.** Its `<nl-strip>` is mounted once by the default layout, so every page gets the newsletter without slices importing each other. Uses static ids (it hydrates lazily). |
| `features/site/about` | `ab-` | `/about`. Static domain content; team and CAC number are `TODO_CONTENT` (team hidden in production). |
| `features/site/programmes` | `pr-` | `/what-we-do` and the six `/what-we-do/<slug>` pages. Static domain content. |
| `features/site/causes` | `cs-` | `/causes` (location filter) and `/causes/<slug>`. Full ports/adapters/mock; funding numbers are `TODO_CONTENT`. |
| `features/site/storybook` | `sb-` | `/create-your-storybook` (landing) and `/create-your-storybook/create` (8-step wizard: name, basics, questions, photo + eye colour, from, dedication, email, pick books). **The 3 books follow the questionnaire answers, never a fixed or random set:** `story-themes.ts` is the theme library (each theme says when it fits and how it uses the answers), `story-templates.ts` scores them and gives every answered question (activity, pet, food, place, funny habit) a book before any answer gets a second one; siblings and pets join as sidekicks, and each book lists what it was `inspiredBy`. Classic stories (and a bedtime story for ages 1–3) only fill gaps. The photo stays in the browser (object URL) and needs a guardian-consent tick. The pick step adds books to a **cart** (`composition/use-cart.ts`: useState + localStorage, loaded after mount; its saver runs in a detached effect scope so it outlives the page). `/cart` → `/checkout` → **Paystack** (redirect to Paystack's hosted page) → `/checkout/complete`, which verifies the payment on our server (`server/api/storybook/checkout.post.ts`, `checkout/verify.get.ts`). The server recomputes every total from the price settings (`NUXT_PUBLIC_STORYBOOK_PRICE_NGN`, delivery fees for Nigeria / abroad; unset = "price coming soon", no charging) and sends the full order as Paystack metadata, so orders are visible in the Paystack dashboard without a database. Cart, checkout and complete are noindex and out of the sitemap. `/childrens-books` 301s here. Each book carries a `coverPrompt` (`infrastructure/mock/cover-prompts.ts`, matching the approved Flick samples); when the real service returns `coverUrl`, the AI cover replaces the drawn stand-in. Sample covers on the landing/home: `shared/storybook-samples.ts` + `NCoverStack` (masters in `brand/storybook/`). **AI covers** (real, not mock): `server/api/storybook/covers.post.ts` re-writes the stories server-side and draws each cover with OpenAI `gpt-image-2.5-sunburst` from the child's photo; off until `NUXT_OPENAI_API_KEY` + `NUXT_PUBLIC_STORYBOOK_AI_COVERS=1` are set (see `.env.example`). The consent text and privacy policy switch with that flag. Daily per-IP and site-wide limits guard spending (in-memory: one server process). Flick has no public API, which is why the server calls OpenAI directly. |
| `features/site/involved` | `gi-` | `/get-involved` hub plus volunteer, mentor and partner forms (yup schemas live in the domain). |
| `features/site/news` | `nw-` | `/news` and `/news/stories`. Production shows an empty state until a post is publishable. |
| `features/site/contact` | `ct-` | `/contact`: details plus a message form. |
| `features/site/donate` | `dn-` | `/donate`: a **pledge**, not a payment. No payment provider yet; never fake a payment step. `?cause=<slug>` pre-selects a cause (applied after mount, because the page is prerendered). |
| `features/site/legal` | `lg-` | Privacy, terms (plain-language **drafts**, flagged on the page) and `/credits`. |

Where two slices need the same small list (cause titles in programmes, donate and home), the list
is **duplicated and both copies say so**, rather than one slice importing another.

Barrels export domain, query keys and port types only. Nothing inside a slice imports its own
barrel. Features don't import each other.

## Routes

`shared/site-routes.ts` is the single registry. Nav, footer, sitemap and prerender all read it.
Every route now has a real page. Cause and focus-area detail paths are generated from
`CAUSE_SLUGS` / `FOCUS_AREA_SLUGS`, so all 26 pages prerender. Unknown paths 404 through `error.vue`
(which reuses `<n-coming-soon>`).
`/_styleguide` is the dev-only design-system page: 404 in production, excluded from the sitemap,
and disallowed in robots.
