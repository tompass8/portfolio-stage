import { gsap } from "gsap";
import { prefersReducedMotion } from "./smooth-scroll";
import { networkNodes } from "../data/network";

export function initGovernanceSection() {
  const section = document.querySelector<HTMLElement>("#governance");
  if (!section) return;

  // Interaction clic/clavier sur les nœuds de la cartographie SVG
  const nodeEls = section.querySelectorAll<SVGGElement>("[data-net-node]");
  const titleEl = section.querySelector<HTMLElement>("[data-node-title]");
  const roleEl = section.querySelector<HTMLElement>("[data-node-role]");
  const ownerEl = section.querySelector<HTMLElement>("[data-node-owner]");
  const dataEl = section.querySelector<HTMLElement>("[data-node-data]");
  const backupEl = section.querySelector<HTMLElement>("[data-node-backup]");
  const gdprEl = section.querySelector<HTMLElement>("[data-node-gdpr]");

  const selectNode = (id: string) => {
    const found = networkNodes.find((n) => n.id === id);
    if (!found) return;
    if (titleEl) titleEl.textContent = found.label;
    if (roleEl) roleEl.textContent = found.role;
    if (ownerEl) ownerEl.textContent = found.owner;
    if (dataEl) dataEl.textContent = found.dataTypes;
    if (backupEl) backupEl.textContent = found.backupPolicy;
    if (gdprEl) gdprEl.textContent = found.gdprStatus;
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

  // Verrouillage du cadenas RGPD et flux réseau au scroll
  const shackle = section.querySelector<SVGPathElement>("[data-lock-shackle]");
  const links = section.querySelectorAll<SVGPathElement>("[data-net-link]");

  if (prefersReducedMotion()) {
    if (shackle) shackle.style.transform = "translateY(0)";
    return;
  }

  if (shackle) {
    gsap.to(shackle, {
      y: 0,
      duration: 0.7,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: "[data-gdpr-card]",
        start: "top 75%",
        once: true,
      },
    });
  }

  if (links.length > 0) {
    gsap.to(links, {
      strokeDashoffset: -48,
      duration: 2.5,
      ease: "none",
      repeat: -1,
    });
  }
}