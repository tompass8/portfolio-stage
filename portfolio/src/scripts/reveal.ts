// src/scripts/reveal.ts — révélations de titres au scroll (type EnduroSat TextReveal)
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(SplitText);

export function initReveal() {
  if (prefersReducedMotion()) return;

  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  els.forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  const titles = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-title]"));
  if (!titles.length) return;

  titles.forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (self) => {
        // Re-split (resize/police) après une révélation déjà jouée : on garde le texte visible
        if (el.dataset.revealed === "1") {
          gsap.set(self.lines, { yPercent: 0 });
          return;
        }
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => {
            el.dataset.revealed = "1";
          },
        });
      },
    });
  });
}
