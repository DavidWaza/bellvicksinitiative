/**
 * The floating Donate pill: appears after the user has scrolled `showAfter` px and hides again
 * while the footer (`#site-footer`) is in view. Always false during SSR.
 */
export default function useFloatingDonate(showAfter = 480) {
  const scrolledPast = ref(false);
  const footerVisible = ref(false);
  const visible = computed(() => scrolledPast.value && !footerVisible.value);

  let observer: IntersectionObserver | undefined;
  const onScroll = () => {
    scrolledPast.value = window.scrollY > showAfter;
  };

  onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const footer = document.getElementById("site-footer");
    if (footer && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        footerVisible.value = entry?.isIntersecting ?? false;
      });
      observer.observe(footer);
    }
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    observer?.disconnect();
  });

  return { visible };
}
