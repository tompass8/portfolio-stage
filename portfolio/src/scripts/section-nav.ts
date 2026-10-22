// src/scripts/section-nav.ts — rail de progression des sections + bouton CTA fixe
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

export function initSectionNav() {
  const nav = document.querySelector<HTMLElement>("[data-section-nav]");
  const items = nav ? Array.from(nav.querySelectorAll<HTMLElement>("[data-nav-item]")) : [];

  items.forEach((item) => {
    const id = item.dataset.navItem;
    const section = id ? document.querySelector<HTMLElement>(`#${id}`) : null;
    const fill = item.querySelector<HTMLElement>("[data-nav-fill]");
    if (!section) return;

    const apply = (active: boolean, progress: number) => {
      item.classList.toggle("is-active", active);
      if (fill && active) fill.style.transform = `scaleY(${progress.toFixed(4)})`;
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => apply(self.isActive, self.progress),
      onToggle: (self) => apply(self.isActive, self.progress),
    });

    // État initial (section déjà à l'écran au chargement)
    apply(trigger.isActive, trigger.progress);
  });

  initFixedCta();
}

function initFixedCta() {
  const cta = document.querySelector<HTMLElement>("[data-fixed-cta]");
  if (!cta) return;

  const show = () => cta.classList.add("is-visible");
  const hide = () => cta.classList.remove("is-visible");

  if (prefersReducedMotion()) {
    show();
    return;
  }

  ScrollTrigger.create({
    trigger: "#hero",
    start: "bottom 85%",
    onEnter: show,
    onLeaveBack: hide,
  });

  ScrollTrigger.create({
    trigger: "#contact",
    start: "top 75%",
    onEnter: hide,
    onLeaveBack: show,
  });
}
