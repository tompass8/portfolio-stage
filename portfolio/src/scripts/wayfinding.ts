// src/scripts/wayfinding.ts — la destination suivie reste surlignée dans le bandeau
export function initWayfinding() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-sign-link]"));
  const targets = links
    .map((link) => document.getElementById(link.dataset.signLink ?? ""))
    .filter((el): el is HTMLElement => el !== null);
  if (!targets.length) return;

  const setCurrent = (id: string | null) => {
    links.forEach((link) => {
      if (link.dataset.signLink === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setCurrent(visible[visible.length - 1].target.id);
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}
