/**
 * Inline <head> script that owns scroll-reveal for server-rendered content.
 *
 * Why inline: content marked `data-reveal` is hidden (under `.motion-ok`) until it is revealed.
 * If revealing waited for Vue — the directive only runs after its section hydrates, and lower
 * sections hydrate lazily — a slow device or network would show blank sections while the user
 * scrolls. This script runs before first paint, needs no bundle, and reveals as soon as an element
 * scrolls into view. The `v-reveal` directive only handles elements created later on the client
 * (client-side navigation), via the same observer exposed as `window.__bvReveal`.
 *
 * Fail-safes: no `.motion-ok` (nothing hidden) under prefers-reduced-motion or without JS; and if
 * IntersectionObserver is missing, everything is revealed immediately.
 */
export const REVEAL_HEAD_SCRIPT = `(function () {
  var root = document.documentElement;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;
  root.classList.add("motion-ok");
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.setAttribute("data-revealed", "");
        io.unobserve(entries[i].target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  window.__bvReveal = io;
  function scan() {
    var els = document.querySelectorAll("[data-reveal]:not([data-revealed]),[data-draw]:not([data-revealed])");
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
})();`;
