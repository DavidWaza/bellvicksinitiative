<template>
  <div class="flex min-h-dvh flex-col">
    <NSkipLink />
    <NMaskDefs />
    <sh-header />
    <main id="main" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </main>
    <LazyNlStrip hydrate-on-visible />
    <sh-footer />
    <LazyShFloatingDonate hydrate-on-idle />
  </div>
</template>
