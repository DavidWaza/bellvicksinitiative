<template>
  <header
    :class="
      cn(
        'sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'bg-base-0/85 shadow-[0_1px_0_0_var(--base-150)] backdrop-blur-md'
          : 'bg-base-50',
      )
    "
  >
    <NContainer size="wide" class="flex h-[72px] items-center justify-between gap-3">
      <NuxtLink
        :to="ROUTES.home"
        aria-label="Bellvicks Initiative — home"
        class="inline-flex min-h-11 items-center rounded-full"
      >
        <sh-header-logo />
      </NuxtLink>

      <sh-header-desktop-nav class="hidden lg:flex" />

      <div class="flex items-center gap-2 sm:gap-3">
        <NButton :to="ROUTES.donate" size="sm" class="px-3.5 sm:px-4">
          <NIcon name="heart" weight="fill" />
          Send Relief
        </NButton>
        <div class="lg:hidden"><sh-header-mobile-sheet /></div>
      </div>
    </NContainer>
  </header>
</template>

<script setup lang="ts">
import { ROUTES } from "~/shared/site-routes";

const { scrolled } = useHeaderScroll();
</script>
