import { observeOnce } from "~/utils/in-view";

/** True once the element has scrolled into view (and stays true). Always false during SSR. */
export function useInView(target: Ref<HTMLElement | SVGElement | null | undefined>) {
  const inView = ref(false);
  let stop: (() => void) | undefined;

  onMounted(() => {
    if (!target.value) return;
    stop = observeOnce(target.value, () => {
      inView.value = true;
    });
  });
  onBeforeUnmount(() => stop?.());

  return inView;
}
