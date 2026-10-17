import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

export function initHero() {
  const hero = document.querySelector<HTMLElement>("#hero");
  const typewriterEl = document.querySelector<HTMLElement>("[data-typewriter]");
  const cursorEl = document.querySelector<HTMLElement>("[data-typewriter-cursor]");
  const revealEls = document.querySelectorAll<HTMLElement>("[data-hero-reveal]");

  if (!hero || !typewriterEl) return;

  const fullText = typewriterEl.dataset.typewriter || "Architecte Web & Gouvernance des Données";

  if (prefersReducedMotion()) {
    typewriterEl.textContent = fullText;
    if (cursorEl) cursorEl.style.display = "none";
    revealEls.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  typewriterEl.textContent = "";
  gsap.set(revealEls, { opacity: 0, y: 18 });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => ScrollTrigger.refresh(),
  });

  tl.to(revealEls[0], { opacity: 1, y: 0, duration: 0.5 }, 0.1);

  const proxy = { count: 0 };
  tl.to(
    proxy,
    {
      count: fullText.length,
      duration: 1.65,
      ease: "none",
      onUpdate: () => {
        typewriterEl.textContent = fullText.slice(0, Math.round(proxy.count));
      },
    },
    0.35
  );

  tl.to(
    Array.from(revealEls).slice(1),
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.12,
    },
    "-=0.35"
  );
}