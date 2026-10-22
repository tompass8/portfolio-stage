import { useState } from "react";
import { rolesMatrix } from "../../data/roles";
import { cn } from "../../lib/utils";

const badgeStyles = {
  FULL: "border-neon-violet/50 bg-neon-violet/15 text-neon-violet",
  "READ/WRITE": "border-neon-blue/50 bg-neon-blue/15 text-neon-blue",
  "READ-ONLY": "border-ok/50 bg-ok/15 text-ok",
  ISOLATED: "border-amber-400/50 bg-amber-400/15 text-amber-300",
};

export default function RolesMatrix() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = rolesMatrix[activeIdx];

  return (
    <div className="rounded-2xl border border-neon-violet/25 bg-surface/85 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs text-neon-violet">MATRICE IAM &amp; DROITS D'ACCÈS</span>
          <h3 className="font-sans text-lg font-bold text-white">
            Gestion des comptes, authentifications &amp; moindre privilège
          </h3>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Matrice cible proposée — le rôle « Développeur Web / Stagiaire » est ma future position, pas un poste occupé aujourd'hui.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400">RBAC Policy v2.6</span>
      </div>

      {/* Onglets de sélection de rôle */}
      <div className="mt-4 flex flex-wrap gap-2">
        {rolesMatrix.map((item, idx) => (
          <button
            key={item.role}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "min-h-11 rounded-lg border px-4 py-2.5 font-mono text-xs font-semibold transition-all cursor-pointer",
              idx === activeIdx
                ? "border-neon-violet bg-neon-violet/25 text-white shadow-[0_0_16px_rgba(168,85,247,0.45)]"
                : "border-white/30 bg-black/50 text-slate-200 hover:border-neon-violet/70 hover:text-white hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            )}
          >
            {item.role}
          </button>
        ))}
      </div>

      {/* Détails du rôle */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs">
          <div className="text-[10px] uppercase text-slate-400">Acteur / Périmètre</div>
          <div className="mt-1 font-semibold text-white">{current.actor}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs">
          <div className="text-[10px] uppercase text-slate-400">Politique d'Authentification</div>
          <div className="mt-1 font-semibold text-neon-blue">{current.authMethod}</div>
        </div>
      </div>

      {/* Liste des permissions */}
      <div className="mt-4 space-y-2.5">
        {current.permissions.map((perm) => (
          <div
            key={perm.resource}
            className="flex flex-col justify-between gap-2 rounded-xl border border-white/5 bg-black/30 p-3.5 sm:flex-row sm:items-center"
          >
            <div>
              <div className="font-mono text-xs font-semibold text-white">{perm.resource}</div>
              <div className="mt-0.5 text-xs text-slate-400">{perm.justification}</div>
            </div>
            <span
              className={cn(
                "self-start sm:self-center shrink-0 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold",
                badgeStyles[perm.access]
              )}
            >
              {perm.access}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neon-violet/20 bg-neon-violet/5 px-4 py-2.5 font-mono text-xs text-slate-300">
        <strong className="text-neon-violet">Processus Cycle de Vie :</strong> {current.lifecycleProcess}
      </div>
    </div>
  );
}