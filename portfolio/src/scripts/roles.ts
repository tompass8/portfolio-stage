// src/scripts/roles.ts — matrice IAM : un rôle affiché à la fois, choisi par boutons bascule
export function initRolesMatrix() {
  const root = document.querySelector<HTMLElement>("[data-roles]");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-role-tab]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-role-panel]"));
  const group = root.querySelector<HTMLElement>("[data-roles-tabs]");
  if (!tabs.length || !group) return;

  const select = (idx: number) => {
    tabs.forEach((t, i) => t.setAttribute("aria-pressed", String(i === idx)));
    panels.forEach((p, i) => (p.hidden = i !== idx));
  };

  // Le bouton porte déjà le nom du rôle : le titre du panneau devient redondant
  root.querySelectorAll<HTMLElement>("[data-role-heading]").forEach((h) => h.classList.add("sr-only"));
  group.hidden = false;
  tabs.forEach((t, i) => t.addEventListener("click", () => select(i)));
  select(0);
}
