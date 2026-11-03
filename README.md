# Portfolio & CV interactif — Tom Passerman

Dépôt GitHub du portfolio / CV de **Tom Passerman** (étudiant B.Sc. Informatique, Ynov Toulouse — Full-Stack, Systèmes & Réseaux, Data & IoT).

Trois pages, une même identité visuelle de **signalétique d'aérogare** (jaune balise, noir signalétique, pictogrammes, tableau des départs) :

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | Portfolio général | Trois projets en « portes » numérotées, parcours en tableau des départs, compétences, contact. |
| `/alpha-to-omega` | Candidature dédiée | Candidature de stage chez Alpha to Omega (Toulouse) : web 75 %, méthode, gouvernance 25 % (cartographie SI, matrice IAM, RGPD). Non indexée. |
| `/cv` | CV interactif | Le CV en **monde pixel-art** à défilement horizontal : l'avatar traverse 5 zones. |

> Le code applicatif vit dans **`portfolio/`** ([`portfolio/README.md`](portfolio/README.md)). Les règles de conception sont dans [`portfolio/AGENTS.md`](portfolio/AGENTS.md), le système visuel dans [`DESIGN.md`](DESIGN.md) et le contexte produit dans [`PRODUCT.md`](PRODUCT.md).

---

## Stack

- **Astro 7** (pages statiques, adaptateur `@astrojs/cloudflare`) · **TypeScript strict**
- **Tailwind v4** CSS-first (tokens `@theme`, aucun `tailwind.config.*`)
- Polices auto-hébergées : **Source Sans 3** et **JetBrains Mono** (`@fontsource-variable`)
- Aucune bibliothèque d'animation ni framework client : quelques scripts TypeScript (3,7 à 5,9 Ko par page)
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

`astro.config.mjs` déclare `adapter: cloudflare()` et `wrangler.jsonc` sert `dist/` via le binding `ASSETS`. Le contact se fait par lien `mailto:` direct ; aucun service d'envoi n'est branché.

## Arborescence

```text
site stage/
├── .gitignore
├── README.md             # ce fichier
├── PRODUCT.md            # public, objectif, contraintes du site
├── DESIGN.md             # système visuel (tokens, règles)
└── portfolio/            # application Astro
    ├── public/           # assets statiques (pixel-art du CV, illustrations IoT, favicon)
    ├── src/
    │   ├── components/   # sign/ (signalétique), governance/, game/ (CV)
    │   ├── data/         # contenu éditorial, data-driven
    │   ├── layouts/      # Layout.astro (site) et GameLayout.astro (CV)
    │   ├── lib/          # motion.ts (prefersReducedMotion), utils.ts
    │   ├── pages/        # index.astro, alpha-to-omega.astro, cv.astro
    │   ├── scripts/      # comportements : init*() en TypeScript
    │   └── styles/       # global.css (tokens @theme) + sprites.css (pixel-art)
    ├── astro.config.mjs
    ├── wrangler.jsonc
    └── AGENTS.md         # règles de conception / qualité
```

## Principes

- **DOM-first** : tout le contenu est lisible sans JavaScript ; les scripts n'ajoutent que de l'interaction.
- **Mouvement réduit** : chaque animation a un repli `prefers-reduced-motion` qui affiche l'état final.
- **Sobriété** : pas de lueurs, de dégradés ni de fonds animés ; le jaune est réservé à l'orientation.

---

© Tom Passerman — portfolio et CV interactif.
