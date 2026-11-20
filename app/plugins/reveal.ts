/**
 * `v-reveal` / `v-reveal="index"` — gentle 12px fade-up on scroll, staggered 60ms per index.
 *
 * The server renders `data-reveal="<index>"`; the inline head script (utils/reveal-script.ts)
 * reveals server-rendered elements without waiting for Vue. This directive covers elements Vue
 * creates on the client (after a client-side navigation) by handing them to the same observer.
 * Data attributes, not classes, so hydration and re-renders never fight over them.
 */
declare global {
  interface Window {
    __bvReveal?: IntersectionObserver;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, number | undefined>("reveal", {
    getSSRProps(binding) {
      return { "data-reveal": String(binding.value ?? 0) };
    },
    beforeMount(el, binding) {
      el.setAttribute("data-reveal", String(binding.value ?? 0));
    },
    mounted(el) {
      if (el.hasAttribute("data-revealed")) return;
      // No observer (reduced motion or old browser) → nothing is hidden, nothing to do.
      window.__bvReveal?.observe(el);
    },
    unmounted(el) {
      window.__bvReveal?.unobserve(el);
    },
  });
});
