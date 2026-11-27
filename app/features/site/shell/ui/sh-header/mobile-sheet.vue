<template>
  <div>
    <button
      ref="triggerEl"
      type="button"
      aria-label="Open menu"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-controls="mobile-menu"
      class="flex size-11 cursor-pointer items-center justify-center rounded-full border border-base-150 bg-base-0 text-forest-900"
      @click="show"
    >
      <NIcon name="menu" size="1.5rem" />
    </button>

    <!--
      Native <dialog>: showModal() gives a focus trap, an inert background and Esc-to-close with no
      JavaScript library. Clicking the backdrop (the dialog element itself) closes it.
    -->
    <dialog
      id="mobile-menu"
      ref="dialogEl"
      aria-labelledby="mobile-menu-title"
      class="mobile-menu fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-[min(92vw,420px)] max-w-none overflow-y-auto bg-base-50 p-0 text-base-900 shadow-2xl"
      @click="onDialogClick"
      @close="open = false"
    >
      <div class="flex flex-col gap-6 p-6 pt-5">
        <div class="flex items-center justify-between gap-4">
          <h2 id="mobile-menu-title" class="font-display text-2xl font-semibold text-forest-900">
            Menu
          </h2>
          <button
            type="button"
            aria-label="Close menu"
            class="flex size-11 cursor-pointer items-center justify-center rounded-full bg-base-100 text-base-900 transition-colors hover:bg-base-150"
            @click="close"
          >
            <NIcon name="close" size="1.25rem" />
          </button>
        </div>

        <!-- Create your storybook, featured first (also listed below as "Storybook") -->
        <NuxtLink
          :to="ROUTES.storybook"
          class="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-coral-100 p-4 text-base-950"
        >
          <NIconBlob icon="books" tone="coral" shape="blob-2" class="size-14" />
          <span class="min-w-0">
            <span class="block text-lg font-bold">Create your storybook</span>
            <span class="block text-sm text-base-600">Starring your child</span>
          </span>
          <NSticker class="absolute top-2 right-3 text-base">New ✨</NSticker>
        </NuxtLink>

        <nav aria-label="Mobile">
          <ul class="flex flex-col">
            <li v-for="item in plainItems" :key="item.id" class="border-b border-base-150">
              <!-- Native disclosure for sub-menus -->
              <details v-if="item.children" class="group">
                <summary
                  class="flex min-h-12 cursor-pointer list-none items-center justify-between py-2 text-lg font-medium text-base-900 [&::-webkit-details-marker]:hidden"
                >
                  {{ item.label }}
                  <NIcon name="caretDown" class="transition-transform group-open:rotate-180" />
                </summary>
                <ul class="flex flex-col pb-3 pl-2">
                  <li v-for="leaf in item.children" :key="leaf.href">
                    <NuxtLink
                      :to="leaf.href"
                      class="flex min-h-11 items-center gap-3 rounded-lg py-2 text-base-600"
                    >
                      <NIcon
                        v-if="leaf.icon"
                        :name="leaf.icon"
                        weight="duotone"
                        class="text-forest-500"
                      />
                      {{ leaf.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </details>
              <NuxtLink
                v-else
                :to="item.href"
                active-class="text-forest-500"
                class="flex min-h-12 items-center py-2 text-lg font-medium text-base-900"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <NButton :to="ROUTES.donate" size="lg" class="w-full">
          <NIcon name="heart" weight="fill" /> Send Relief
        </NButton>

        <address
          class="flex flex-col gap-1 border-t border-base-150 pt-5 text-sm text-base-600 not-italic"
        >
          <span class="flex items-start gap-2">
            <NIcon name="pin" class="mt-0.5 shrink-0 text-forest-500" />
            {{ SITE_INFO.address.street }}, {{ SITE_INFO.address.locality }},
            {{ SITE_INFO.address.country }}
          </span>
          <NLink
            v-for="phone in SITE_INFO.phones"
            :key="phone.href"
            :to="phone.href"
            class="flex min-h-11 items-center gap-2 font-medium text-base-900"
          >
            <NIcon name="phone" class="text-forest-500" /> {{ phone.display }}
          </NLink>
          <NLink
            :to="`mailto:${SITE_INFO.email}`"
            class="flex min-h-11 items-center gap-2 font-medium text-base-900"
          >
            <NIcon name="mail" class="text-forest-500" /> {{ SITE_INFO.email }}
          </NLink>
        </address>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";
import { NAV_ITEMS } from "../../domain/site-nav";

const dialogEl = ref<HTMLDialogElement | null>(null);
const triggerEl = ref<HTMLButtonElement | null>(null);
const open = ref(false);

function show() {
  dialogEl.value?.showModal();
  open.value = true;
}

function close() {
  dialogEl.value?.close();
}

/** A click on the dialog element itself (not its content) is a click on the backdrop. */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialogEl.value) close();
}

// Lock page scroll while open; return focus to the menu button on close (native dialog does this
// too, but only when it was opened by keyboard focus on the trigger).
watch(open, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? "hidden" : "";
  if (!isOpen) triggerEl.value?.focus();
});

const route = useRoute();
watch(
  () => route.fullPath,
  () => close(),
);

onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
});

// "Create your storybook" is featured above the list, and also listed in its usual place,
// labelled simply "Storybook".
const plainItems = NAV_ITEMS.map((i) => (i.featured ? { ...i, label: "Storybook" } : i));
</script>
