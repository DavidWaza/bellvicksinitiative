type Callback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Callback>();

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = callbacks.get(entry.target);
        observer?.unobserve(entry.target);
        callbacks.delete(entry.target);
        cb?.();
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );
  return observer;
}

/** Calls `cb` once, the first time `el` scrolls into view. Client-only. Returns a stop function. */
export function observeOnce(el: Element, cb: Callback): () => void {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  callbacks.set(el, cb);
  getObserver().observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}
