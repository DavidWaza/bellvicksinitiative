<template>
  <nav
    ref="navEl"
    aria-label="Main"
    :class="cn('relative', props.class)"
    @keydown.esc="closeAndFocus"
  >
    <ul class="flex items-center gap-0.5 xl:gap-1">
      <li
        v-for="item in NAV_ITEMS"
        :key="item.id"
        :class="cn('relative', item.id === 'home' && 'hidden 2xl:block')"
        @pointerenter="item.children && onPointerEnter($event, item.id)"
        @pointerleave="item.children && onPointerLeave($event)"
        @focusout="onFocusOut($event, item.id)"
      >
        <!-- Dropdown: a disclosure button + panel (WAI-ARIA disclosure navigation pattern) -->
        <template v-if="item.children">
          <button
            :ref="(el) => setTrigger(item.id, el as HTMLButtonElement | null)"
            type="button"
            :aria-expanded="openId === item.id"
            :aria-controls="`nav-panel-${item.id}`"
            :class="cn(LINK, 'group cursor-pointer', isSectionActive(item) && 'text-forest-500')"
            @click="toggle(item.id)"
          >
            {{ item.label }}
            <NIcon
              name="caretDown"
              size="0.85em"
              :class="cn('transition-transform duration-200', openId === item.id && 'rotate-180')"
            />
          </button>
          <div
            v-show="openId === item.id"
            :id="`nav-panel-${item.id}`"
            class="nav-panel absolute top-full left-0 z-50 pt-3"
          >
            <sh-header-mega-what-we-do v-if="item.mega" />
            <ul v-else class="w-64 rounded-2xl border border-base-150/70 bg-base-0 p-2 shadow-soft">
              <li v-for="leaf in item.children" :key="leaf.href">
                <NuxtLink
                  :to="leaf.href"
                  class="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 font-medium text-base-900 transition-colors hover:bg-forest-50 hover:text-forest-500"
                >
                  <NIcon
                    v-if="leaf.icon"
                    :name="leaf.icon"
                    weight="duotone"
                    size="1.35rem"
                    class="text-forest-500"
                  />
                  {{ leaf.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </template>

        <!-- The signature item -->
        <NuxtLink
          v-else-if="item.featured"
          :to="item.href"
          active-class="is-active"
          :class="cn(LINK, 'gap-1.5 hover:text-coral-700 [&.is-active]:text-coral-700')"
        >
          <NIcon
            name="book"
            weight="duotone"
            size="1.25rem"
            class="hidden text-coral-500 xl:block"
          />
          {{ item.label }}
          <!-- The longer "Create your storybook" label only leaves room for the sticker from xl up. -->
          <NSticker class="-mt-4 -ml-0.5 hidden -rotate-6 px-1.5 py-0 text-base xl:inline-flex"
            >New ✨</NSticker
          >
        </NuxtLink>

        <!-- Plain link -->
        <NuxtLink
          v-else
          :to="item.href"
          active-class="is-active"
          :class="cn(LINK, '[&.is-active]:text-forest-500')"
        >
          {{ item.label }}
          <span
            class="absolute inset-x-3 bottom-1 hidden h-0.5 rounded-full bg-accent-500 [.is-active>&]:block"
            aria-hidden="true"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { NAV_ITEMS, type NavItem } from "../../domain/site-nav";

/**
 * Main navigation without a menu library: dropdowns follow the WAI-ARIA *disclosure* pattern
 * (a button with aria-expanded controlling a panel of ordinary links), which is the recommended
 * pattern for site navigation. Behaviour:
 * - click / Enter / Space toggles; Esc closes and returns focus to the button;
 * - hover opens with a mouse (with a short grace period on leave), never with touch;
 * - focus leaving the item, a click outside, or a route change closes it.
 * Panels are v-show, so every link is in the server HTML for crawlers.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const LINK =
  "relative inline-flex h-11 items-center gap-1 rounded-full px-1.5 text-[0.875rem] font-medium whitespace-nowrap text-base-900 transition-colors hover:text-forest-500 xl:px-2 2xl:px-3 2xl:text-[0.9375rem]";

const navEl = ref<HTMLElement | null>(null);
const openId = ref<string | null>(null);
const triggers = new Map<string, HTMLButtonElement>();
let leaveTimer: ReturnType<typeof setTimeout> | undefined;
/** True while the open panel was opened by mouse hover (not yet clicked). */
let openedByHover = false;

function setTrigger(id: string, el: HTMLButtonElement | null) {
  if (el) triggers.set(id, el);
  else triggers.delete(id);
}

function toggle(id: string) {
  // With a mouse, hovering already opened this panel: the click "pins" it rather than closing it.
  if (openId.value === id && openedByHover) {
    openedByHover = false;
    return;
  }
  openedByHover = false;
  openId.value = openId.value === id ? null : id;
}

function closeAndFocus() {
  if (!openId.value) return;
  const trigger = triggers.get(openId.value);
  openId.value = null;
  trigger?.focus();
}

function onPointerEnter(event: PointerEvent, id: string) {
  if (event.pointerType !== "mouse") return;
  clearTimeout(leaveTimer);
  if (openId.value !== id) {
    openId.value = id;
    openedByHover = true;
  }
}

function onPointerLeave(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  clearTimeout(leaveTimer);
  // A pinned (clicked) panel stays open when the mouse leaves; a hover-opened one closes.
  if (!openedByHover) return;
  leaveTimer = setTimeout(() => {
    openId.value = null;
    openedByHover = false;
  }, 150);
}

function onFocusOut(event: FocusEvent, id: string) {
  const li = event.currentTarget as HTMLElement;
  if (openId.value === id && !li.contains(event.relatedTarget as Node | null)) openId.value = null;
}

function onDocumentPointerDown(event: PointerEvent) {
  if (openId.value && !navEl.value?.contains(event.target as Node)) openId.value = null;
}

const route = useRoute();
watch(
  () => route.fullPath,
  () => (openId.value = null),
);

function isSectionActive(item: NavItem) {
  return route.path === item.href || route.path.startsWith(`${item.href}/`);
}

onMounted(() => document.addEventListener("pointerdown", onDocumentPointerDown));
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  clearTimeout(leaveTimer);
});
</script>
