export type ProjectCategory = "web" | "api" | "iot";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  architecture: string;
  description: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  image: string;
  repoUrl?: string;
  status: "production" | "prototype" | "containerized";
  category: ProjectCategory;
}

export const projects: Project[] = [
  {
    id: "01",
    slug: "le-gourmand",
    title: "Le Gourmand",
    subtitle: "Application Web 3-Tiers & Conteneurisation",
    architecture: "Client -> Express 5 API -> MySQL 8 (Docker Network)",
    description:
      "Plateforme de partage de recettes orchestrée avec Docker Compose. Isolation stricte des réseaux, exécution via utilisateurs non-root et persistance relationnelle optimisée.",
    stack: ["Node.js", "Express", "MySQL", "Docker Compose", "Tailwind CSS"],
    metrics: [
      { label: "Architecture", value: "3-Tiers isolée" },
      { label: "Conteneurs", value: "Non-root / Alpine" },
    ],
    image: "/projects/le-gourmand.webp",
    repoUrl: "https://github.com/tompass8",
    status: "containerized",
    category: "web",
  },
  {
    id: "02",
    slug: "ymmo",
    title: "YMMO — Groupe Immobilier",
    subtitle: "Plateforme web d'achat, vente et analyse de biens immobiliers avec IA",
    architecture: "Vue 3 ─► Nginx ─► (.NET 10 ─► PostgreSQL 16) + (FastAPI ─► 2M biens)",
    description:
      "Plateforme immobilière en trois services orchestrés par Docker Compose : API .NET 10 (auth JWT, CRUD biens/offres), SPA Vue 3 + Pinia (catalogue, dashboards Chart.js) et agrégateur Python FastAPI analysant 2M de biens via scikit-learn.",
    stack: ["Vue 3", ".NET 10", "PostgreSQL 16", "FastAPI / Python", "Docker Compose"],
    metrics: [
      { label: "Base agrégée", value: "2M de biens (IA)" },
      { label: "Services", value: "3 conteneurs" },
    ],
    image: "/projects/ymmo.webp",
    repoUrl: "https://github.com/tompass8",
    status: "containerized",
    category: "api",
  },
  {
    id: "03",
    slug: "spark",
    title: "SPARK",
    subtitle: "Système IoT Embarqué & Télémétrie Temps Réel",
    architecture: "ESP8266 (Magnétomètres) --[ESP-NOW]--> ESP32 Master -> Web UI",
    description:
      "Détection intelligente de places de parking par variation de champ magnétique. Communication maillée basse consommation via protocole ESP-NOW et remontée temps réel sur tableau de bord web.",
    stack: ["ESP32 / ESP8266", "C / C++", "ESP-NOW", "Capteurs Magnétiques", "Web API"],
    metrics: [
      { label: "Protocole", value: "ESP-NOW (<10ms)" },
      { label: "Topologie", value: "Master / Slaves" },
    ],
    image: "/projects/spark.webp",
    repoUrl: "https://github.com/tompass8",
    status: "prototype",
    category: "iot",
  },
];