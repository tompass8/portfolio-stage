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

        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
          <img
            src={project.image}
            alt=""
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-75 grayscale-[45%] transition duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-x-3 bottom-2.5 font-mono text-[10px] leading-snug text-neon-blue">
            <span className="text-slate-400">$</span> {project.architecture}
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