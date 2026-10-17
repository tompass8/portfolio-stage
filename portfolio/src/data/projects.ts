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
    image: "/projects/le-gourmand.svg",
    repoUrl: "https://github.com/tompass8",
    status: "containerized",
  },
  {
    id: "02",
    slug: "taskboard",
    title: "TaskBoard",
    subtitle: "API Kanban Temps Réel & Clean Architecture",
    architecture: "Domain <- Application <- Infrastructure / WebAPI",
    description:
      "Back-end C# .NET structuré selon les principes de la Clean Architecture. Persistance via Entity Framework Core et SQLite, synchronisation temps réel des colonnes par WebSockets.",
    stack: ["C# .NET", "Clean Architecture", "EF Core", "SQLite", "SignalR"],
    metrics: [
      { label: "Couplage", value: "Inversion de dép." },
      { label: "Sync", value: "Temps réel" },
    ],
    image: "/projects/taskboard.svg",
    repoUrl: "https://github.com/tompass8",
    status: "production",
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
    image: "/projects/spark.svg",
    repoUrl: "https://github.com/tompass8",
    status: "prototype",
  },
];