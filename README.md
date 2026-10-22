# Portfolio & CV interactif — Tom Passerman

Dépôt GitHub du portfolio / CV de **Tom Passerman** (Ingénieur IT — Full-Stack, Systèmes & Réseaux, Data & IoT).

Deux expériences cohabitent dans le même projet :

| Route | Expérience | Description |
| :--- | :--- | :--- |
| `/` | Portfolio « ligne de temps » | Version site classique, éditoriale et scrollable : parcours, projets, gouvernance, processus, contact. |
| `/cv` | CV interactif gamifié | Le CV sous forme de **monde pixel-art** horizontal (8 200 px) : on « marche » dans une barre de progression, on saute sur les props, on traverse 5 zones, et un **hélicoptère de police** traverse le ciel en tirant une fusée sur le décor. |

> Le code applicatif vit dans **`portfolio/`**. La documentation détaillée du projet est dans [`portfolio/README.md`](portfolio/README.md), les règles de conception et de qualité dans [`portfolio/AGENTS.md`](portfolio/AGENTS.md).

---

## Stack

- **Astro 7** (SSR via `@astrojs/cloudflare`) · **React 19** · **TypeScript strict**
- **Tailwind v4** CSS-first (tokens `@theme`, aucun `tailwind.config.*`)
- **GSAP 3.15** (`ScrollTrigger`, `SplitText`) + **Lenis** pour le scroll fluide
- **Wrangler 4** pour le déploiement Cloudflare Workers

## Prérequis

- **Node.js ≥ 22.22.0** (voir `engines.node` dans `portfolio/package.json`)
- npm (livré avec Node)
- Un compte Cloudflare uniquement pour le déploiement

## Commandes

```bash
cd portfolio
npm install          # installe les dépendances
npm run dev          # serveur de dev sur http://localhost:4321
npm run build        # build de production dans portfolio/dist/
npm run preview      # prévisualise le build (avec l'adaptateur Cloudflare)
npm run check        # vérification TypeScript + Astro (astro check)
npm run generate-types   # wrangler types → types des bindings Cloudflare
```

> En développement, le serveur se lance idéalement en arrière-plan : `astro dev --background`
> (pilotage : `astro dev status`, `astro dev logs`, `astro dev stop`).

## Déploiement

```bash
cd portfolio
npm run build
npx wrangler deploy
```

`astro.config.mjs` déclare `adapter: cloudflare()` et `wrangler.jsonc` sert `dist/` via le binding `ASSETS`.
La route `src/pages/api/contact.ts` reste en SSR (`prerender = false`) : l'envoi d'e-mail n'est volontairement pas
branché (la route répond `501` et bascule vers un `mailto:` affiché à l'utilisateur).

## Arborescence

```text
site stage/
├── .gitignore            # artefacts Astro générés à la racine du dépôt
├── README.md             # ce fichier (page d'accueil du dépôt)
└── portfolio/            # application Astro
    ├── public/           # assets statiques (pixel-art, photos, illustrations IoT)
    ├── src/
    │   ├── components/   # Astro (structure & contenu) + React (widgets interactifs)
    │   ├── data/         # tout le contenu éditorial, data-driven
    │   ├── layouts/      # Layout.astro (site) et GameLayout.astro (CV)
    │   ├── lib/          # motion.ts (GSAP + prefersReducedMotion), utils.ts
    │   ├── pages/        # index.astro, cv.astro, api/contact.ts
    │   ├── scripts/      # orchestration : init*() GSAP
    │   └── styles/       # global.css (tokens @theme) + sprites.css (pixel-art)
    ├── astro.config.mjs
    ├── wrangler.jsonc
    └── AGENTS.md         # règles de conception / qualité (source de vérité)
```

## Principes

- **DOM-first** : le DOM est la source de vérité (SEO, accessibilité, fonctionnement sans JS) ; le décor visuel n'est qu'une couche posée par-dessus.
- **Mouvement réduit** : chaque animation possède un fallback `prefers-reduced-motion` affichant l'état final visible.
- **Animations propres** : uniquement `transform` / `opacity`, cibles via attributs `data-*`, nettoyage complet des tweens et listeners.

Le détail de ces règles, les budgets de performance et la dette technique connue sont documentés dans
[`portfolio/README.md`](portfolio/README.md) et [`portfolio/AGENTS.md`](portfolio/AGENTS.md).

---

© Tom Passerman — portfolio et CV interactif.
