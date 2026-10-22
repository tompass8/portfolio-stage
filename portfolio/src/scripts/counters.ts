// src/scripts/counters.ts — compteurs animés au scroll (type count-number-reveal d'EnduroSat)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

const format = (value: number, target: number) =>
  value.toLocaleString("fr-FR", {
    minimumFractionDigits: Number.isInteger(target) ? 0 : 1,
    maximumFractionDigits: 1,
  });

export function initCounters() {
  const els = document.querySelectorAll<HTMLElement>("[data-counter]");
  if (!els.length || prefersReducedMotion()) return;

  els.forEach((el) => {
    const end = parseFloat(el.dataset.endVal ?? el.textContent ?? "0");
    if (!Number.isFinite(end)) return;

    el.textContent = format(0, end);
    const proxy = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          val: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(proxy.val, end);
          },
          onComplete: () => {
            el.textContent = format(end, end);
          },
        });
      },
    });
  });
}
