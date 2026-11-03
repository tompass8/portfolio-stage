import { useState } from "react";
import { rolesMatrix } from "../../data/roles";
import { cn } from "../../lib/utils";

// Le niveau d'accès se lit au premier coup d'œil : plein = tout, barré = isolé
const badgeStyles = {
  FULL: "bg-ink text-sign",
  "READ/WRITE": "border-2 border-ink bg-sign text-ink",
  "READ-ONLY": "border-2 border-ink bg-panel text-ink",
  ISOLATED: "border-2 border-dashed border-ink bg-panel text-ink",
};

export default function RolesMatrix() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = rolesMatrix[activeIdx];

  return (
    <div className="rounded-[6px] bg-panel p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-3xl font-bold leading-tight tracking-[-0.015em]">
          Gestion des comptes, authentifications &amp; moindre privilège
        </h3>
        <span className="font-mono text-sm text-muted">RBAC Policy v2.6</span>
      </div>
      <p className="mt-2 max-w-[46rem] text-lg text-muted">
        Matrice IAM &amp; droits d'accès. Matrice cible proposée — le rôle « Développeur Web / Stagiaire » est ma future position, pas un poste occupé aujourd'hui.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choisir un rôle">
        {rolesMatrix.map((item, idx) => (
          <button
            key={item.role}
            type="button"
            aria-pressed={idx === activeIdx}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "min-h-11 cursor-pointer rounded-[6px] px-4 py-2 text-lg font-semibold transition-colors duration-150",
              idx === activeIdx ? "bg-ink text-sign" : "border-2 border-ink bg-panel text-ink hover:bg-sign"
            )}
          >
            {item.role}
          </button>
        ))}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
        <div className="border-t-[3px] border-ink pt-2">
          <dt className="text-base text-muted">Acteur / Périmètre</dt>
          <dd className="text-xl font-semibold">{current.actor}</dd>
        </div>
        <div className="border-t-[3px] border-ink pt-2">
          <dt className="text-base text-muted">Politique d'Authentification</dt>
          <dd className="text-xl font-semibold">{current.authMethod}</dd>
        </div>
      </dl>

      <ul className="mt-6 divide-y-2 divide-concrete border-y-2 border-concrete">
        {current.permissions.map((perm) => (
          <li key={perm.resource} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-lg font-semibold">{perm.resource}</div>
              <div className="text-base text-muted">{perm.justification}</div>
            </div>
            <span className={cn("self-start shrink-0 rounded-[4px] px-2.5 py-0.5 font-mono text-sm font-semibold tracking-[0.06em] sm:self-center", badgeStyles[perm.access])}>
              {perm.access}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-[6px] bg-concrete px-4 py-3 text-lg">
        <strong>Processus Cycle de Vie :</strong> {current.lifecycleProcess}
      </p>
    </div>
  );
}
