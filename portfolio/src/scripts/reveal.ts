// src/scripts/reveal.ts — déclenche les apparitions au défilement (classe .is-in, une seule fois)
export function initReveal() {
  if (!document.documentElement.classList.contains("js-motion")) return;
  const targets = document.querySelectorAll<HTMLElement>("[data-rise], [data-sign], [data-route], [data-plan]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}
