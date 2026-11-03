import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import { networkNodes } from "../data/network";

export function initGovernanceSection() {
  const section = document.querySelector<HTMLElement>("#gouvernance");
  if (!section) return;

  // Inspection des nœuds de la cartographie (clic et clavier)
  const nodeEls = Array.from(section.querySelectorAll<SVGGElement>("[data-net-node]"));
  const fields = {
    title: section.querySelector<HTMLElement>("[data-node-title]"),
    role: section.querySelector<HTMLElement>("[data-node-role]"),
    owner: section.querySelector<HTMLElement>("[data-node-owner]"),
    data: section.querySelector<HTMLElement>("[data-node-data]"),
    backup: section.querySelector<HTMLElement>("[data-node-backup]"),
    gdpr: section.querySelector<HTMLElement>("[data-node-gdpr]"),
  };

  const selectNode = (id: string) => {
    const found = networkNodes.find((n) => n.id === id);
    if (!found) return;
    if (fields.title) fields.title.textContent = found.label;
    if (fields.role) fields.role.textContent = found.role;
    if (fields.owner) fields.owner.textContent = found.owner;
    if (fields.data) fields.data.textContent = found.dataTypes;
    if (fields.backup) fields.backup.textContent = found.backupPolicy;
    if (fields.gdpr) fields.gdpr.textContent = found.gdprStatus;
    nodeEls.forEach((el) => {
      const on = el.dataset.netNode === id;
      el.setAttribute("aria-pressed", String(on));
      el.querySelector("[data-node-ring]")?.setAttribute("fill", on ? "#ffcc00" : "#ffffff");
    });
  };

  nodeEls.forEach((el) => {
    el.addEventListener("click", () => selectNode(el.dataset.netNode || ""));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectNode(el.dataset.netNode || "");
      }
    });
  });

  // Le cadenas RGPD se verrouille une fois, à la première vue
  const shackle = section.querySelector<SVGPathElement>("[data-lock-shackle]");
  if (!shackle) return;
  if (prefersReducedMotion()) {
    shackle.style.transform = "translateY(0)";
    return;
  }
  gsap.to(shackle, {
    y: 0,
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: { trigger: "[data-gdpr-card]", start: "top 75%", once: true },
  });
}
