export interface RolePermission {
  role: string;
  actor: string;
  authMethod: string;
  permissions: {
    resource: string;
    access: "FULL" | "READ/WRITE" | "READ-ONLY" | "ISOLATED";
    justification: string;
  }[];
  lifecycleProcess: string;
}

export const rolesMatrix: RolePermission[] = [
  {
    role: "Administrateur SI / DevOps",
    actor: "Équipe interne A2Ω",
    authMethod: "Clé SSH Ed25519 + MFA matériel",
    permissions: [
      { resource: "Cloudflare DNS & Workers", access: "FULL", justification: "Déploiement, certificats TLS et diagnostic d'incidents" },
      { resource: "Dépôts GitHub (Branche main)", access: "READ/WRITE", justification: "Validation des Pull Requests et CI/CD" },
      { resource: "Bases de données Prod", access: "READ/WRITE", justification: "Vérification des sauvegardes et plan de reprise (PRA)" },
    ],
    lifecycleProcess: "Revue trimestrielle des comptes à privilèges + révocation immédiate des tokens en cas de départ.",
  },
  {
    role: "Développeur Web / Stagiaire",
    actor: "Tom Passerman",
    authMethod: "SSO + 2FA (TOTP) + Token Git scopé",
    permissions: [
      { resource: "Environnement Staging / Preview", access: "FULL", justification: "Tests de fonctionnalités Astro, APIs et correction de bugs" },
      { resource: "Dépôts GitHub (Feature branches)", access: "READ/WRITE", justification: "Développement modulaire et revue de code assistée par IA" },
      { resource: "Bases de données Prod", access: "READ-ONLY", justification: "Moindre privilège : diagnostic sans risque d'altération" },
    ],
    lifecycleProcess: "Onboarding documenté : attribution d'accès sur périmètre projet uniquement.",
  },
  {
    role: "Référent Gouvernance / DPO",
    actor: "Direction Client & Consultant A2Ω",
    authMethod: "SSO Entreprise + MFA obligatoire",
    permissions: [
      { resource: "Cartographie SI & Registre RGPD", access: "FULL", justification: "Audit des traitements, sous-traitants et durées de rétention" },
      { resource: "Journaux d'accès & Audit IAM", access: "READ-ONLY", justification: "Contrôle de conformité des habilitations" },
      { resource: "Code Source Applicatif", access: "ISOLATED", justification: "Aucun accès requis au code pour garantir la séparation des rôles" },
    ],
    lifecycleProcess: "Validation des états des lieux et priorisation du plan d'actions sécurité.",
  },
  {
    role: "Prestataire Externe / API Tierce",
    actor: "Service externe (CRM, Mailer, IA)",
    authMethod: "Clé API restreinte par IP + Quota",
    permissions: [
      { resource: "Webhook / Endpoint dédié", access: "ISOLATED", justification: "Cloisonnement strict : accès limité à la route API autorisée" },
      { resource: "Données personnelles (PII)", access: "ISOLATED", justification: "Pseudonymisation avant envoi vers un outil d'IA externe" },
      { resource: "Réseau interne", access: "ISOLATED", justification: "Zéro accès direct à l'infrastructure interne" },
    ],
    lifecycleProcess: "Inventaire des dépendances critiques et contrat de sous-traitance RGPD (DPA).",
  },
];