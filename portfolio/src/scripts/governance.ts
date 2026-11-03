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
    nodeEls.forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.netNode === id)));
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

  // Le cadenas RGPD (verrouillé par défaut) s'ouvre puis se verrouille à la première vue
  const card = section.querySelector<HTMLElement>("[data-gdpr-card]");
  if (!card || prefersReducedMotion()) return;
  card.classList.add("is-open");
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      card.classList.remove("is-open");
      observer.disconnect();
    },
    { rootMargin: "0px 0px -25% 0px" }
  );
  observer.observe(card);
}
