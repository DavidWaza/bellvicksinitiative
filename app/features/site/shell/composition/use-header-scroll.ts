/** True once the page has scrolled past `threshold` px — drives the header's frosted state. */
export default function useHeaderScroll(threshold = 24) {
  const scrolled = ref(false);

  function update() {
    scrolled.value = window.scrollY > threshold;
  }

  onMounted(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
  });
  onBeforeUnmount(() => window.removeEventListener("scroll", update));

  return { scrolled };
}
