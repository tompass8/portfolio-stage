// src/data/resumeData.ts — contenu du CV interactif gamifié (séparé de la vue)

export type SpriteState = "idle" | "run-left" | "run-right" | "jump" | "use";

export interface ZoneControlHint {
  icon: "mouse-scroll" | "arrow-keys";
  label: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Avancé / Expert" | "Expert";
  pct: number;
  items: { name: string; icon?: string }[];
}

export interface JobEntry {
  id: string;
  company: string;
  period: string;
  role: string;
  missions: string[];
  props: string[];
}

export interface TaskSplit {
  label: string;
  value: number;
}

export interface ProjectEntry {
  id: string;
  name: string;
  kind: "IoT" | "Web" | "Game";
  summary: string;
  features: string[];
  stack: string[];
  checkpoint: boolean;
}

export interface ResumeZone {
  id: string;
  index: number;
  hash: string;
  level: string;
  title: string;
  short: string;
  subtitle: string;
  kind: "spawn" | "skills" | "experience" | "projects" | "contact";
  width: number;
  hasTerminal?: boolean;
}

export interface ContactChannel {
  label: string;
  href: string;
  value: string;
}

export interface ResumeData {
  meta: {
    name: string;
    headline: string;
    location: string;
  };
  zones: ResumeZone[];
  spawn: {
    bio: string;
    highlights: string[];
    controls: ZoneControlHint[];
  };
  skills: {
    intro: string;
    groups: SkillGroup[];
  };
  experience: {
    intro: string;
    jobs: JobEntry[];
    split: TaskSplit[];
  };
  projects: {
    intro: string;
    items: ProjectEntry[];
  };
  contact: {
    intro: string;
    channels: ContactChannel[];
  };
}

export const resumeData: ResumeData = {
  meta: {
    name: "Tom Passerman",
    headline: "Passionné d'IT — Full-Stack, Systèmes & Réseaux, Data & IoT",
    location: "Toulouse, France",
  },

  zones: [
    {
      id: "zone-spawn",
      index: 0,
      hash: "intro",
      level: "ZONE 00 // SPAWN & IDENTITÉ",
      title: "Bienvenue à bord",
      short: "Intro",
      subtitle: "Origines, profil et prise en main",
      kind: "spawn",
      width: 1400,
    },
    {
      id: "zone-skills",
      index: 1,
      hash: "competences",
      level: "NIVEAU 01 // LA FORGE TECHNIQUE",
      title: "Matrice des compétences",
      short: "Compétences",
      subtitle: "Salle de serveurs & laboratoire",
      kind: "skills",
      width: 1600,
    },
    {
      id: "zone-experience",
      index: 2,
      hash: "experiences",
      level: "NIVEAU 02 // LES QG",
      title: "Quartiers généraux professionnels",
      short: "Expériences",
      subtitle: "ITL & Orange — infrastructures critiques",
      kind: "experience",
      width: 1600,
    },
    {
      id: "zone-projects",
      index: 3,
      hash: "projets",
      level: "NIVEAU 03 // LE LABO & L'USINE",
      title: "Projets phares & prototype IoT",
      short: "Projets",
      subtitle: "Hardware, Cloud et systèmes embarqués",
      kind: "projects",
      width: 2200,
    },
    {
      id: "zone-contact",
      index: 4,
      hash: "contact",
      level: "NIVEAU 04 // BOSS FINAL",
      title: "Le Terminal de Contact",
      short: "Contact",
      subtitle: "Borne d'arcade — envoie ton message",
      kind: "contact",
      width: 1400,
      hasTerminal: true,
    },
  ],

  spawn: {
    bio: "Étudiant en informatique et passionné d'IT, je m'intéresse au développement Full-Stack, aux systèmes & réseaux, à la data et à l'IoT. B.Sc. Informatique à Ynov Campus Toulouse. J'apprends en construisant : des applications web & mobiles, du prototype au déploiement, et l'infrastructure qui les fait tourner.",
    highlights: [
      "B.Sc. Informatique — Ynov Campus Toulouse",
      "Bilingue Français / Anglais (anglais technique courant)",
      "Full-Stack · Systèmes & Réseaux · Data · IoT",
    ],
    controls: [
      { icon: "mouse-scroll", label: "Molette pour avancer dans le monde" },
      { icon: "arrow-keys", label: "Flèches clavier — le héros suit ton scroll" },
    ],
  },

  skills: {
    intro:
      "Quatre familles de compétences, du code applicatif jusqu'au silicium embarqué.",
    groups: [
      {
        id: "fullstack",
        title: "Dev Full-Stack",
        level: "Débutant",
        pct: 20,
        items: [
          { name: "C# (.NET 8)", icon: "csharp" },
          { name: "Python", icon: "python" },
          { name: "Java", icon: "java" },
          { name: "PHP", icon: "php" },
          { name: "TypeScript / JS", icon: "typescript" },
          { name: "Astro", icon: "astro" },
          { name: "Tailwind CSS", icon: "tailwindcss" },
        ],
      },
      {
        id: "data",
        title: "Data & Bases de données",
        level: "Intermédiaire",
        pct: 30,
        items: [
          { name: "SQL (MySQL, SQLite)", icon: "mysql" },
          { name: "InfluxDB (Time-Series)" },
          { name: "Entity Framework Core" },
          { name: "PDO" },
          { name: "Pandas / NumPy" },
          { name: "Matplotlib" },
          { name: "Grafana" },
        ],
      },
      {
        id: "infra",
        title: "Infra, Réseaux, Sécu & DevOps",
        level: "Avancé",
        pct: 70,
        items: [
          { name: "Docker & Docker Compose", icon: "docker" },
          { name: "Linux (Bash, WSL2)", icon: "linux" },
          { name: "Windows Server" },
          { name: "mTLS" },
          { name: "Mosquitto MQTT" },
          { name: "OpenLDAP" },
          { name: "Git / GitHub", icon: "git" },
        ],
      },
      {
        id: "iot",
        title: "Hardware & Systèmes Embarqués (IoT)",
        level: "Intermédiaire",
        pct: 50,
        items: [
          { name: "ESP32", icon: "/assets/iot/esp32-chip.svg" },
          { name: "ESP8266 (ESP-12F)" },
          { name: "Arduino" },
          { name: "Magnétomètre 3 axes (PNI RM3100)", icon: "/assets/iot/rm3100-chip.svg" },
          { name: "Cellules de charge" },
          { name: "Infrarouge" },
          { name: "Optimisation Low-Power" },
        ],
      },
    ],
  },

  experience: {
    intro:
      "Deux terrains d'infrastructure : réseaux critiques et parcs systèmes d'entreprise.",
    jobs: [
      {
        id: "itl",
        company: "ITL",
        period: "2025 – 2026",
        role: "Administrateur Systèmes & Réseaux",
        missions: [
          "Gestion et déploiement d'infrastructures réseau critiques",
          "Mise en place et configuration de systèmes de vidéosurveillance IP",
        ],
        props: ["security-cam", "server-rack"],
      },
      {
        id: "orange",
        company: "Orange",
        period: "Juillet 2023 – Août 2023",
        role: "Support IT & Administrateur Systèmes",
        missions: [
          "Automatisation des déploiements logiciels",
        ],
        props: ["telecom-tower", "control-screen"],
      },
    ],
    split: [
      { label: "SysAdmin", value: 45 },
      { label: "Réseau", value: 35 },
      { label: "Dev", value: 20 },
    ],
  },

  projects: {
    intro:
      "Cinq checkpoints, du prototype IoT jusqu'au jeu de plateforme.",
    items: [
      {
        id: "spark",
        name: "Spark — Smart Parking IoT",
        kind: "IoT",
        summary:
          "Détection temps réel de présence de véhicules par variation de champ magnétique, présenté aux YDays. Infrastructure conteneurisée isolée avec MQTT chiffré, stockage time-series et supervision Grafana.",
        features: [
          "ESP32 / ESP8266 + magnétomètres 3 axes",
          "MQTT sécurisé par mTLS (Mosquitto)",
          "InfluxDB pour la donnée time-series",
          "Dashboards temps réel Grafana",
        ],
        stack: ["ESP32", "Mosquitto MQTT + mTLS", "InfluxDB", "Grafana", "Docker"],
        checkpoint: true,
      },
      {
        id: "terravault",
        name: "TerraVault",
        kind: "Web",
        summary:
          "Application sur-mesure de registre foncier numérique et de cartographie des limites de propriétés.",
        features: [
          "Registre foncier numérique",
          "Cartographie et délimitation des parcelles",
          "Application sur-mesure, du cadrage au déploiement",
        ],
        stack: ["Web", "Base de données relationnelle", "Cartographie"],
        checkpoint: true,
      },
      {
        id: "taskboard",
        name: "TaskBoard",
        kind: "Web",
        summary:
          "API collaborative de gestion de tâches Kanban, en C# .NET 8 avec Clean Architecture et synchronisation temps réel.",
        features: [
          "Clean Architecture (.NET 8)",
          "Entity Framework Core + SQLite",
          "Synchronisation temps réel via SignalR",
        ],
        stack: ["C# .NET 8", "Entity Framework Core", "SQLite", "SignalR"],
        checkpoint: true,
      },
      {
        id: "le-gourmand",
        name: "Le Gourmand",
        kind: "Web",
        summary:
          "Application web 3-tiers conteneurisée, développée en équipe avec Docker Compose.",
        features: [
          "Architecture 3-tiers (Node.js, Express, MySQL)",
          "Environnement conteneurisé reproductible",
          "Travail en équipe et intégration continue",
        ],
        stack: ["Node.js", "Express", "MySQL", "Docker Compose"],
        checkpoint: true,
      },
      {
        id: "moodle-jump",
        name: "Moodle Jump",
        kind: "Game",
        summary:
          "Jeu de plateforme 2D développé sous Unity — intégré au décor sous forme de plateformes flottantes sur lesquelles l'avatar saute lors du scroll.",
        features: [
          "Développement de jeu 2D sous Unity",
          "Physique et contrôles de plateforme",
          "Intégration web du jeu",
        ],
        stack: ["Unity", "C#"],
        checkpoint: true,
      },
    ],
  },

  contact: {
    intro:
      "Tu es arrivé au bout du niveau. Laisse un message : l'agent te répondra.",
    channels: [
      { label: "GitHub", href: "https://github.com/tompass8", value: "tompass8" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tom-passerman", value: "Tom Passerman" },
      { label: "Email", href: "mailto:tompasserman5@gmail.com", value: "tompasserman5@gmail.com" },
    ],
  },
};

export const totalWorldWidth = resumeData.zones.reduce((sum, z) => sum + z.width, 0);
