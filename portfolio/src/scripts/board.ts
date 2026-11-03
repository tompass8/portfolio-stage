// src/scripts/board.ts — le tableau des départs se met à jour en volet à la première vue
import { prefersReducedMotion } from "../lib/motion";

export function initBoards() {
  const boards = Array.from(document.querySelectorAll<HTMLElement>("[data-board]"));
  if (!boards.length || prefersReducedMotion()) return;

  boards.forEach((board) => {
    board.querySelectorAll<HTMLElement>(".flap").forEach((el, i) => el.style.setProperty("--i", String(i)));
    board.classList.add("is-pending");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  boards.forEach((b) => observer.observe(b));
}
