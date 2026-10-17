import React, { useRef, useState } from "react";
import type { Project } from "../../data/projects";
import { cn } from "../../lib/utils";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const rotateY = (relX - 0.5) * 12;
    const rotateX = (0.5 - relY) * 12;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
    );
    setGlare({ x: relX * 100, y: relY * 100, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <article
      ref={cardRef}
      data-project-card
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/80 p-6 backdrop-blur-md",
        "transition-transform duration-200 ease-out hover:border-neon-blue/50"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(360px circle at ${glare.x}% ${glare.y}%, rgba(0, 229, 255, 0.28), transparent 70%)`,
        }}
      />

      <div>
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-neon-blue">#{project.id} // {project.slug}</span>
          <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[11px] text-slate-300">
            {project.status}
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-black/70 via-surface to-neon-blue/10 p-4">
          <div className="font-mono text-[11px] text-slate-400">ARCHITECTURE PIPELINE</div>
          <div className="mt-2 font-mono text-xs font-medium text-neon-blue">
            {project.architecture}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <span className="size-1.5 rounded-full bg-ok"></span>
            <span>asset: {project.image}</span>
          </div>
        </div>

        <h3 className="mt-5 font-sans text-xl font-bold text-white group-hover:text-neon-blue transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-slate-400">{project.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-lg bg-black/30 px-3 py-2">
              <div className="font-mono text-[10px] uppercase text-slate-400">{m.label}</div>
              <div className="font-mono text-xs font-semibold text-white">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-neon-blue/20 bg-neon-blue/5 px-2 py-0.5 font-mono text-[11px] text-neon-blue"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}