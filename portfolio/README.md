# Portfolio — Tom Passerman

Site portfolio / CV de Tom Passerman (étudiant B.Sc. Informatique, Ynov Toulouse — Full-Stack, Systèmes & Réseaux, Data & IoT), construit avec **Astro 7** et **Tailwind v4** (CSS-first), déployé sur **Cloudflare Workers** via l'adaptateur `@astrojs/cloudflare`.

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | Portfolio général | Portes projets, tableau des départs du parcours, annuaire des compétences, contact. |
| `/alpha-to-omega` | Candidature dédiée | Textes de candidature Alpha to Omega, module CI/CD, méthode, démos de gouvernance. `noindex`. |
| `/cv` | CV interactif | Monde pixel-art horizontal de 5 zones (8 200 px). `noindex`. |

### Positionnement éditorial

Les missions de la page `/alpha-to-omega` sont présentées comme le terrain visé, jamais comme des postes occupés. Les seuls employeurs réellement exercés sont ITL (2025–2026) et Orange (2023).

---

## 1. Prérequis

- **Node.js ≥ 22.22.0** (`engines.node` dans `package.json`)
- npm (livré avec Node)
- Un compte Cloudflare uniquement pour le déploiement (le build local n'en a pas besoin)

## 2. Installation & commandes

```bash
npm install          # installe les dépendances
npm run dev          # serveur de dev sur http://localhost:4321
npm run build        # build de production dans ./dist/
npm run preview      # prévisualise le build (avec l'adaptateur Cloudflare)
npm run check        # vérification TypeScript + Astro (astro check)
npm run generate-types   # wrangler types → types des bindings Cloudflare
```

> En développement, le serveur se lance idéalement en arrière-plan : `astro dev --background`
> (pilotage : `astro dev status`, `astro dev logs`, `astro dev stop`).

## 3. Structure du projet

```text
portfolio/
├── public/                  # pixel-art du CV (assets/), favicon
├── src/
│   ├── components/
│   │   ├── sign/            # signalétique : SignBand, GateLink, SectionSign, ProjectGate,
│   │   │                    #   Route, DepartureBoard, Directory, ContactPanel, Picto, SiteFooter
│   │   ├── governance/      # NetworkMap, GdprLock, RolesMatrix (démos de gouvernance)
│   │   └── game/            # InteractiveWorld, HudNavigation (CV)
│   ├── data/                # contenu éditable : projects, roles, network, resumeData
│   ├── layouts/             # Layout.astro (site) et GameLayout.astro (CV)
│   ├── lib/                 # motion.ts (prefersReducedMotion)
│   ├── pages/               # index.astro, alpha-to-omega.astro, cv.astro
│   ├── scripts/             # wayfinding, board, governance, roles, cv-world, cv-avatar
│   └── styles/              # global.css (tokens @theme) + sprites.css (pixel-art)
├── astro.config.mjs         # cloudflare() + @tailwindcss/vite
├── wrangler.jsonc           # Worker Cloudflare, binding ASSETS, observability
└── AGENTS.md                # règles de conception / qualité
```

## 4. Architecture

Le projet est **DOM-first** : tout le contenu est rendu en HTML par Astro et reste lisible sans JavaScript.

- **Astro** = structure & contenu, entièrement statique. Aucun framework client ni îlot hydraté.
- **`src/scripts/*.ts`** = comportements en TypeScript sans dépendance. Chaque module exporte un `init*()` appelé depuis le layout, cible le DOM via des attributs `data-*` (jamais une classe CSS) et respecte `prefersReducedMotion()`.
  - `wayfinding.ts` : le bandeau d'orientation surligne la section visible (`aria-current`).
  - `board.ts` : le tableau des départs se met à jour en volet à sa première apparition.
  - `governance.ts` / `roles.ts` : cartographie réseau inspectable, cadenas RGPD, matrice IAM.
- **`src/data/*.ts`** = tout le contenu éditorial est data-driven et modifiable sans toucher au markup.
- **`src/styles/global.css`** = tokens Tailwind v4 en `@theme static` ; le système visuel est documenté dans `../DESIGN.md`.

### Le monde du CV (`/cv`)

`InteractiveWorld.astro` compose un monde horizontal de 5 zones (largeur totale 8 200 px) :

| Zone | Hash | Largeur | Contenu |
| :--- | :--- | :--- | :--- |
| `zone-spawn` | `#intro` | 1 400 px | Biographie, points forts, commandes |
| `zone-skills` | `#competences` | 1 600 px | Matrice des compétences (jauges à segments) |
| `zone-experience` | `#experiences` | 1 600 px | Expériences ITL & Orange, répartition des tâches |
| `zone-projects` | `#projets` | 2 200 px | Cartes projets |
| `zone-contact` | `#contact` | 1 400 px | E-mail et canaux |

Le monde défile sur un **axe horizontal natif** : `[data-hscroll]` est un vrai scroller (`overflow-x: auto`) et `cv-world.ts` lit son `scrollLeft` pour déplacer `data-world-container` en `transform`. Les positions des décors sont **mesurées une fois** (chargement, redimensionnement, polices prêtes) puis déduites par calcul à chaque scroll, sans relire le layout. Les calques de fond suivent à des vitesses différentes (parallaxe via `.world-layer` dimensionnées en `calc(100% + var(--world-w))`).

**Entrées** : trackpad horizontal, swipe tactile, **molette verticale remappée** sur l'axe horizontal (avec passage au footer aux extrémités), flèches ← → au clavier, et boutons de téléportation du HUD (la zone courante est exposée via `aria-current`).

**Seuil « empilé »** : le layout vertical (zones les unes sous les autres, décors masqués) n'est utilisé que pour `prefers-reduced-motion: reduce` **ou** une fenêtre très courte `(max-height: 640px)`. Ce seuil est défini **à l'identique** dans `sprites.css` et dans `isStacked()` (`cv-world.ts`) : les garder alignés.

## 5. Accessibilité & mouvement réduit

- Contenu complet sans JavaScript : `/cv` a aussi un bloc `<noscript>` ; la matrice IAM affiche ses quatre rôles empilés.
- Lien d'évitement « Aller au contenu », navigation clavier complète, focus visible (cadre noir de 3 px), boutons bascule en `aria-pressed`.
- Contrastes WCAG AA (souvent AAA) ; texte secondaire teinté de son fond.
- `prefers-reduced-motion: reduce` : pas de volet sur le tableau, cadenas déjà verrouillé, CV empilé, sprites figés.

## 6. Performance

- JavaScript par page : ≈ 3,7 Ko (`/`, `/alpha-to-omega`) et ≈ 5,9 Ko (`/cv`).
- Aucune animation infinie hors sprites du CV ; aucun `filter: blur`, ombre colorée ni fond animé.
- Parallaxe et monde du CV en `transform` uniquement.

## 7. Déploiement (Cloudflare Workers)

```bash
npm run build
npx wrangler deploy
```

`astro.config.mjs` déclare `adapter: cloudflare()` ; `wrangler.jsonc` sert `dist/` via le binding `ASSETS` (avec `Cache-Control` immuable injecté sur `/_astro/*`). L'observabilité est activée.

## 8. À compléter

- **Captures des projets** : aucune image de projet pour l'instant (les photos de banque d'images ont été retirées). À ajouter en WebP ≤ 1600 px.
- **Envoi d'e-mail** : le contact est un `mailto:` direct. Brancher un service d'envoi suppose une route serveur et une variable d'environnement jamais exposée au client.

## 9. Conventions

Le détail des règles se trouve dans **`AGENTS.md`**, le système visuel dans **`../DESIGN.md`**. En résumé :

- scripts < ~120 lignes, composants < 300 lignes ;
- TypeScript strict, aucun `any` non justifié ;
- tout nouveau style passe par un token `@theme` ;
- cibles JS via attributs `data-*` ;
- `npm run check` à 0 erreur et `npm run build` vert avant toute livraison.

---

© Tom Passerman — portfolio et CV interactif.
