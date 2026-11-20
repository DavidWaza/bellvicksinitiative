# Bellvicks design system: component index

The single catalogue of `app/components/n/`. Don't start a second one (ARCHITECTURE Part IV).
Every component auto-registers as `<NName />` or `<n-name />` (`pathPrefix: false`). See them all
together at **`/_styleguide`** (dev only).

Conventions every part follows (ARCHITECTURE §4): `data-slot="…"`, `cn(defaults, props.class)`,
a real `class` prop, and slots instead of content props. Variants live in a sibling
`*-variants.ts`, with colour × variant resolved in `compoundVariants`.

## Layout and type

| Component | File | Notes |
| --- | --- | --- |
| `NContainer` | `container/NContainer.vue` | `size="narrow \| default \| wide"` (760 / 1200 / 1360px) with responsive gutters. |
| `NSection` | `section/NSection.vue` + `section-variants.ts` | `tone="cream \| white \| mint \| lavender \| sun \| forest"`, `spacing="none \| sm \| default"`, `as` (native tag), `labelledby`. |
| `NEyebrow` | `eyebrow/NEyebrow.vue` | 12px uppercase label. `tone="accent \| coral \| forest \| light"`. Uses `accent-700`, not 600, for contrast. |
| `NHeading` | `heading/NHeading.vue` | `as="h1…h4"`, `size="display \| h2 \| h3 \| h4"`. Fraunces 600 with the SOFT axis. |
| `NHeadingHighlight` | `heading/NHeadingHighlight.vue` | Part of a heading: colour plus a hand-drawn swoosh. `tone="accent \| coral \| forest \| light"`. **Large text only** (contrast). |
| `NSkipLink` | `skip-link/NSkipLink.vue` | "Skip to main content", targets `#main`. Mounted once in the layout. |
| `NPageHero` | `page-hero/NPageHero.vue` | Top band of every inner page: breadcrumbs, eyebrow, **the page's one `h1`** (default slot, so `NHeadingHighlight` works inside it), `#lead`, `#actions` and an optional `#media` column. |
| `NBreadcrumbs` | `breadcrumbs/NBreadcrumbs.vue` | `items: { label, to? }[]`. "Home" is implied; the last item gets `aria-current="page"`. |
| `NProse` | `prose/NProse.vue` | Long-form text styling (legal pages, cause descriptions) via descendant selectors. |
| `NCtaBand` | `cta-band/NCtaBand.vue` | The closing forest call-to-action band (wavy edge, spark). Default slot = heading; `#lead`, `#actions`. |
| `NEmptyState` | `empty-state/NEmptyState.vue` | "Nothing here yet" panel: what production shows where `TODO_CONTENT` lists would be (news, stories, books library). |

## Actions and links

| Component | File | Notes |
| --- | --- | --- |
| `NButton` | `button/NButton.vue` + `button-variants.ts` | `color="primary \| brand \| coral \| light"` × `variant="solid \| ghost \| link"`, `size="sm \| default \| lg \| icon"` (all ≥44px). Pass `to` to render a link. Orange and coral solids use dark ink. |
| `NLink` | `link/NLink.vue` | Internal paths go through `NuxtLink`. `http(s)`, `mailto:` and `tel:` render `<a>`, and http(s) opens in a new tab with `rel="noopener noreferrer"`. |

## Surfaces

| Component | File | Notes |
| --- | --- | --- |
| `NCard` | `card/NCard.vue` | White, `rounded-2xl`, the soft warm shadow. |
| `NCardMedia` | `card/NCardMedia.vue` | 16:10 media frame; put `NBlobImage mask="none"` inside. |
| `NCardBody` | `card/NCardBody.vue` | Flex column, `p-5`, grows to fill. |
| `NCardFooter` | `card/NCardFooter.vue` | Bottom action row. |
| `NSheet` | `sheet/NSheet.vue` | Reka `DialogRoot` with `v-model:open` (used by the volunteer sheet; the header menu is a native `<dialog>` instead). **Renders no element**, so a `class` on it is dropped. Wrap it in a `div` to hide or show it. |
| `NSheetTrigger` | `sheet/NSheetTrigger.vue` | `DialogTrigger as-child`; wraps your button. |
| `NSheetContent` | `sheet/NSheetContent.vue` | Portal, overlay and a right-side panel with a close button. Focus trap and Esc come from Reka. |
| `NSheetTitle` / `NSheetDescription` | `sheet/…` | Required for an accessible name and description (the description can be `sr-only`). |

## Media and decoration

| Component | File | Notes |
| --- | --- | --- |
| `NBlobImage` | `blob-image/NBlobImage.vue` | Photo in a mask: `mask="africa \| blob-1…4 \| circle \| arch \| none"`. Pass a whole slot as `:image` (from `photo()` in `shared/photos.ts`) or `src` + `alt` + `consent`. Renders `<NuxtPicture>` (AVIF + WebP). **`sizes` uses @nuxt/image syntax** — `"xs:92vw sm:92vw md:45vw lg:560px"`, never CSS media queries (those silently produce 1px images). With no source it shows a warm placeholder. In production a `consent: "pending"` photo is not rendered. `preload` (hero only) emits a `fetchpriority="high"` preload. |
| `NMaskDefs` | `mask-defs/NMaskDefs.vue` | The shared `<clipPath>` defs, mounted once in the default layout. Shapes live in `blob-image/mask-paths.ts`; `maskStyle(name)` applies one to any element. |
| `NIconBlob` | `icon-blob/NIconBlob.vue` | A pastel blob behind a duotone icon. `icon`, `tone`, `shape="blob-1…4"`. Decorative. |
| `NIcon` | `icon/NIcon.vue` | Inline SVG from generated Phosphor path data (`utils/icon-paths.ts`, via `scripts/generate-icons.mjs`). `weight="regular \| duotone \| fill"`: duotone for feature icons, regular for UI chrome. Always `aria-hidden`. |
| `NDoodleBase` | `doodle/NDoodleBase.vue` | Shared SVG shell for doodles: currentColor, 3px round stroke, `aria-hidden`, one-time draw-in when scrolled into view. |
| `NDoodleSpark`, `NDoodleSwoosh`, `NDoodleHeart`, `NDoodleCrown`, `NDoodleSquiggle`, `NDoodleDotCluster`, `NDoodleLeaf` | `doodle/…` | **Max two doodles in view at once.** Colour them with `text-*`. |
| `NDotMap` | `dot-map/NDotMap.vue` + generated `dot-map-path.ts` | Dotted world map at 8% opacity. Regenerate with `node scripts/generate-dot-map.mjs`. Stays inline SVG on its own layer (see AGENTS.md). |
| `NCoverStack` | `cover-stack/NCoverStack.vue` | Two sample storybook covers, tilted and overlapping. `covers: SampleCover[]` from `shared/storybook-samples.ts` (`src` without size/extension: `-360.webp`, `-720.webp`, `-720.jpg`); `eager` above the fold. Default slot = caption. |
| `NPartnerLogo` | `partner-logo/NPartnerLogo.vue` | A partner logo contained in the box set by `class` (height + width). `logo` is the path without extension (`.webp` + `.png` from `scripts/generate-partner-logos.mjs`); falls back to the name as a wordmark. |
| `NAvatarStack` | `avatar-stack/NAvatarStack.vue` | Overlapping circles. With no `src` it shows a neutral silhouette, so there are no invented faces. |
| `NBadge` | `badge/NBadge.vue` | Small pill. `tone` from `utils/tones.ts`. |
| `NSticker` | `badge/NSticker.vue` | The tilted Caveat "New ✨" sticker. Decorative label only. |

## Data display

| Component | File | Notes |
| --- | --- | --- |
| `NStat` | `stat/NStat.vue` | Number, label and icon. Counts up once, only for real numbers, with no layout shift and no motion under reduced-motion. A `TODO_CONTENT` value shows the dev placeholder. |
| `NProgress` | `progress/NProgress.vue` | Reka Progress: raised/goal bar with `formatMoney` and an `aria-valuetext`. Mount it only with real numbers (wrap it in `NTodo`). |
| `NStatus` | `status/NStatus.vue` | `<NStatus :status="raw" />`. Registry, resolver (alias table) and palette live in `utils/status/` (ARCHITECTURE §5.1). Cause states: `active`, `closing_soon`, `funded`, `upcoming`. |
| `NTodo` | `todo/NTodo.vue` | **The `TODO_CONTENT` convention.** Real content renders the default slot. Missing content shows a dashed outline and a "content needed" tag in dev, and the `fallback` slot (default: nothing) in production. |

## Carousel

| Component | File | Notes |
| --- | --- | --- |
| `NCarousel` | `carousel/NCarousel.vue` | Embla root. `label` is required (region name). ←/→ work while focus is inside. No autoplay. |
| `NCarouselContent` | `carousel/NCarouselContent.vue` | Viewport and track. Use `class="-ml-4 gap-0"` together with `pl-4` items. |
| `NCarouselItem` | `carousel/NCarouselItem.vue` | A slide (`role="group"`). Size it with `basis-*`. |
| `NCarouselControls` | `carousel/NCarouselControls.vue` | Prev/next and dot buttons (44px targets, `aria-current`). |

## Forms

| Component | File | Notes |
| --- | --- | --- |
| `NField` | `field/NField.vue` | Label, control slot and hint/error. The slot gets `{ id, describedby, invalid }`; the error uses `role="alert"`. Pair it with vee-validate `defineField`. Uses `useId()`, so don't put it in a lazily hydrated section (see AGENTS.md). |
| `NInput` | `input/NInput.vue` | `v-model`, `invalid`. The border is `base-500` (3:1). |
| `NTextarea` | `textarea/NTextarea.vue` | `v-model`, `invalid`, `rows`. Same border rules as `NInput`. |
| `NSelect` | `select/NSelect.vue` | Styled **native** `<select>` (`options: { value, label }[]`, `placeholder`) — native keyboard and screen-reader behaviour for free. Attributes such as `id` pass to the `<select>`. |
| `NChoiceGroup` | `choice-group/NChoiceGroup.vue` | Radio buttons styled as pills inside a real `fieldset`/`legend`; `v-model`, `options`, `name`, `error`. Used for filters and form choices. |

## Pages

| Component | File | Notes |
| --- | --- | --- |
| `NComingSoon` | `coming-soon/NComingSoon.vue` | On-brand placeholder page. Used by `error.vue` (404 / error); available for any future unbuilt route. `title`, `description`, `icon`, `eyebrow`, plus a slot for extra actions. |
