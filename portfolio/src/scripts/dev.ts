import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

export function initDevSection() {
  const section = document.querySelector<HTMLElement>("#dev");
  const terminal = document.querySelector<HTMLElement>("[data-dev-terminal]");
  const cmdEl = document.querySelector<HTMLElement>("[data-git-cmd]");
  const statusEl = document.querySelector<HTMLElement>("[data-terminal-status]");
  const logs = document.querySelectorAll<HTMLElement>("[data-git-log]");
  const cards = document.querySelectorAll<HTMLElement>("[data-project-card]");

  if (!section || !terminal || !cmdEl) return;

  const fullCmd = cmdEl.dataset.fullCmd || "git push origin main --tags";

  if (prefersReducedMotion()) {
    cmdEl.textContent = fullCmd;
    logs.forEach((l) => (l.style.opacity = "1"));
    cards.forEach((c) => {
      c.style.opacity = "1";
      c.style.transform = "none";
    });
    if (statusEl) statusEl.textContent = "DEPLOYED";
    return;
  }

  cmdEl.textContent = "";
  gsap.set(logs, { opacity: 0, x: -8 });

  const proxy = { chars: 0 };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: terminal,
      start: "top 75%",
      once: true,
    },
  });

  tl.to(proxy, {
    chars: fullCmd.length,
    duration: 0.9,
    ease: "none",
    onUpdate: () => {
      cmdEl.textContent = fullCmd.slice(0, Math.round(proxy.chars));
    },
  });

  tl.to(
    logs,
    {
      opacity: 1,
      x: 0,
      duration: 0.25,
      stagger: 0.18,
      ease: "power2.out",
      onComplete: () => {
        if (statusEl) {
          statusEl.textContent = "DEPLOYED";
          statusEl.className = "rounded bg-ok/15 px-2 py-0.5 text-[11px] text-ok";
        }
      },
    },
    "+=0.1"
  );

  // Révélation des cartes sur leur propre déclencheur (évite de fighting
  // avec le tilt 3D possédé par React sur ProjectCard)
  if (cards.length) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: cards[0],
          start: "top 88%",
          once: true,
        },
      }
    );
  }
}