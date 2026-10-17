export interface NetworkNode {
  id: string;
  label: string;
  role: string;
  owner: string;
  dataTypes: string;
  backupPolicy: string;
  gdprStatus: string;
  x: number;
  y: number;
}

export const networkNodes: NetworkNode[] = [
  {
    id: "edge",
    label: "Cloudflare Edge / DNS",
    role: "WAF, CDN, Certificats TLS & Protection DDoS",
    owner: "Équipe Infra / A2Ω",
    dataTypes: "Logs HTTP anonymisés, IP transitoire",
    backupPolicy: "Config IaC versionnée sur GitHub",
    gdprStatus: "Minimisation dès l'Edge (0 cookie tiers)",
    x: 90,
    y: 130,
  },
  {
    id: "astro",
    label: "Front-End Astro SSR",
    role: "Site sur mesure & Îlots React hydratés",
    owner: "Développeur Web",
    dataTypes: "Formulaires de contact, Sessions",
    backupPolicy: "Build reproductible CI/CD GitHub",
    gdprStatus: "Polices auto-hébergées (aucune fuite Google Fonts)",
    x: 290,
    y: 70,
  },
  {
    id: "api",
    label: "Passerelle API / IAM",
    role: "Contrôle des droits d'accès (RBAC) & MFA",
    owner: "Responsable Sécurité / Admin IT",
    dataTypes: "Jetons JWT, Journaux d'audit d'accès",
    backupPolicy: "Rotation des secrets & logs 90 jours",
    gdprStatus: "Traçabilité des habilitations (Arrivée / Départ)",
    x: 290,
    y: 190,
  },
  {
    id: "db",
    label: "Base de Données & Backups",
    role: "Stockage chiffré & Plan de Reprise (PRA)",
    owner: "DPO / Administrateur Système",
    dataTypes: "Données clients, Registre des traitements",
    backupPolicy: "Snapshot quotidien chiffré + Test de restauration",
    gdprStatus: "Purge auto (droit à l'oubli) & Chiffrement AES-256",
    x: 490,
    y: 130,
  },
];