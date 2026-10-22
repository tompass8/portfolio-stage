import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { projects, type Project, type ProjectCategory } from "../../data/projects";
import { cn } from "../../lib/utils";
import ProjectCard from "./ProjectCard";

type Filter = "all" | ProjectCategory;

const GlobeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 6h9M6 1.5c1.5 1.6 1.5 7.4 0 9M6 1.5C4.5 3.1 4.5 8.9 6 10.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const CodeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M4 3 1.5 6 4 9M8 3l2.5 3L8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChipIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 1.5V3M7 1.5V3M5 9v1.5M7 9v1.5M1.5 5H3M1.5 7H3M9 5h1.5M9 7h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const AllIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="6.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="6.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const categories: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "tous", icon: <AllIcon /> },
  { key: "web", label: "web", icon: <GlobeIcon /> },
  { key: "api", label: "api & cloud", icon: <CodeIcon /> },
  { key: "iot", label: "iot", icon: <ChipIcon /> },
];

export default function ProjectExplorer() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const applyFilter = (next: Filter) => {
    setFilter(next);
    const grid = gridRef.current;
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll<HTMLElement>("[data-filter-item]"));
    const visible: HTMLElement[] = [];
    items.forEach((el) => {
      const match = next === "all" || (el.dataset.category as ProjectCategory) === next;
      el.style.display = match ? "" : "none";
      if (match) visible.push(el);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    visible.forEach((el) => gsap.killTweensOf(el));
    gsap.fromTo(
      visible,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" }
    );
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
          <span className="text-neon-blue">&gt;</span> Sélectionnez un domaine
        </p>
        <div role="tablist" aria-label="Filtrer les projets" className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={filter === cat.key}
              onClick={() => applyFilter(cat.key)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all duration-300",
                filter === cat.key
                  ? "border-neon-blue bg-neon-blue/15 text-neon-blue shadow-[0_0_16px_rgba(0,229,255,0.25)]"
                  : "border-white/30 bg-black/50 text-slate-200 hover:border-neon-blue/60 hover:text-white"
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => (
          <div key={project.id} data-filter-item data-project-card data-category={project.category}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
