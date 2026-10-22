# Portfolio « monde 3D » — Tom Passerman

Site portfolio / CV de Tom Passerman (Ingénieur IT — Full-Stack, Systèmes & Réseaux, Data & IoT), construit avec **Astro 7**, **React 19**, **Tailwind v4** (CSS-first), **GSAP 3.15** et **Lenis**, déployé sur **Cloudflare Workers** via l'adaptateur `@astrojs/cloudflare`.

Deux expériences cohabitent :

| Route | Expérience | Description |
| :--- | :--- | :--- |
| `/` | Portfolio « ligne de temps » | Version site classique, éditoriale et scrollable : parcours, projets, gouvernance, processus, contact. |
| `/cv` | CV interactif gamifié | Le CV sous forme de **monde pixel-art** horizontal (8 200 px) : on « marche » dans une barre de progression, on saute sur les props, on traverse 5 zones, et un **hélicoptère de police** traverse le ciel en tirant une fusée sur le décor. |

### Positionnement éditorial

Les contenus du site décrivent une **candidature chez Alpha to Omega** (Toulouse) : les missions évoquées sont présentées comme le terrain visé, jamais comme des postes occupés. Les seuls employeurs réellement exercés sont ITL (2025–2026) et Orange (2023).

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
npm run astro -- --help
npm run generate-types   # wrangler types → types des bindings Cloudflare
```

> En développement, le serveur se lance idéalement en arrière-plan : `astro dev --background`
> (pilotage : `astro dev status`, `astro dev logs`, `astro dev stop`).

## 3. Structure du projet

```text
portfolio/
├── public/                  # assets statiques servis tels quels (pixel-art, photos, icônes)
├── src/
│   ├── components/
│   │   ├── contact/         # ContactTerminal.tsx (terminal de contact React)
│   │   ├── dev/             # section « Dev », explorateur de projets, pipeline CI/CD
│   │   ├── game/            # InteractiveWorld, HudNavigation, HeliSprite, CvGameCta…
│   │   ├── governance/      # gouvernance, RGPD, matrice des rôles, carte réseau
│   │   ├── hero/            # Hero.astro + Particles.tsx
│   │   ├── media/           # PhotoMarquee.astro
│   │   ├── nav/             # SectionNav, FixedCta
│   │   ├── process/         # ProcessSection.astro
│   │   ├── stats/           # StatsBand.astro
│   │   └── timeline/        # GitTimeline, SectionShell
│   ├── data/                # contenu éditable : projects, stats, roles, network, resumeData
│   ├── layouts/             # Layout.astro (site) et GameLayout.astro (CV)
│   ├── lib/                 # motion.ts (GSAP + prefersReducedMotion), utils.ts
│   ├── pages/               # index.astro, cv.astro, api/contact.ts
│   ├── scripts/             # orchestration : init*() (smooth-scroll, reveal, cv-world…)
│   └── styles/              # global.css (tokens @theme) + sprites.css (pixel-art)
├── astro.config.mjs         # react() + cloudflare() + @tailwindcss/vite
├── wrangler.jsonc           # Worker Cloudflare, bindings ASSETS, observability
└── AGENTS.md                # règles de conception / qualité (source de vérité du projet)
```

## 4. Architecture

Le projet applique le principe **DOM-first** : le DOM est la source de vérité (SEO, accessibilité, fonctionnement sans JS), le décor visuel n'est qu'une couche posée par-dessus.

- **Astro** = structure & contenu (`.astro`), statique par défaut.
- **React** = widgets interactifs isolés (`client:visible` par défaut) : terminal de contact, jeu pare-feu, explorateur de projets, matrice des rôles.
- **`src/scripts/*.ts`** = animations. Convention stricte : chaque module exporte un `init*()` appelé depuis le layout, cible le DOM via des attributs `data-*` (jamais une classe CSS), et fait un **early-return** sur `prefersReducedMotion()`.
- **`src/data/*.ts`** = tout le contenu éditorial (CV, projets, stats, rôles, réseau) est data-driven et modifiable sans toucher au markup.
- **`src/styles/global.css`** = tokens Tailwind v4 déclarés en `@theme static` (aucun `tailwind.config.*`).

### Le monde du CV (`/cv`)

`InteractiveWorld.astro` compose un monde horizontal de 5 zones (largeur totale 8 200 px) :

| Zone | Hash | Largeur | Contenu |
| :--- | :--- | :--- | :--- |
| `zone-spawn` | `#intro` | 1 400 px | Biographie, points forts, commandes |
| `zone-skills` | `#competences` | 1 600 px | Matrice des compétences (jauges à segments) |
| `zone-experience` | `#experiences` | 1 600 px | Expériences ITL & Orange, répartition des tâches |
| `zone-projects` | `#projets` | 2 200 px | Cartes projets + prototype IoT |
| `zone-contact` | `#contact` | 1 400 px | Terminal de contact + canaux |

Le scroll vertical pilote une **translation horizontale** du monde (`data-world-container` déplacé en `transform` par GSAP), les calques de fond suivent à des vitesses différentes (parallaxe via `.world-layer` dimensionnées en `calc(100% + var(--world-w))`), et les props décoratifs sont cliquables (« saut »).

### L'hélicoptère de police (`HeliSprite.astro` + `cv-helicopter.ts` + `sprites.css`)

Animation **100 % CSS** (aucun binaire, aucun canvas) pilotée par une timeline de 20 s (`--heli-cycle`) :

1. l'hélico entre par la gauche et stabilise son altitude ;
2. à ~52 % du cycle, une **fusée** se détache de la coque et pique vers le sol ;
3. à ~59–61 %, **explosion** (flamme, blast, fumée, débris) ;
4. selon la variante tirée au sort :
   - **`hit`** — la fusée percute la coque : l'hélico est détruit (`opacity: 0`), puis le cycle redémarre à 62 % ;
   - **`ground`** — la fusée explose au sol : l'hélico survit, secoué, puis sort par la droite et le cycle repart à 100 %.
5. la variante est tirée au sort à chaque cycle par `initCvHelicopter()` (`data-heli-variant`), qui relance les animations CSS en réinitialisant `animation` sur chaque nœud.

Le sprite est **orienté vers la droite** : le conteneur `.arcade-heli__flip` applique un `scaleX(-1)` à l'ensemble coque + fusée + stabilisateur, ce qui laisse le nez, la verrière et le gyrophare du côté de la progression.

> **Piège de rendu connu** : les animations `transform` compositées ne sont **pas** rasterisées à leur position animée par Chrome en mode headless (`--headless=new --disable-gpu`) — l'hélico y apparaît à `x = -180`, hors écran. Ce n'est pas un bug du site : en navigateur réel (ou via CDP) le rendu est correct. Pour vérifier des frames animées, utiliser Chrome réel + DevTools Protocol.

### Illustrations IoT (`public/assets/iot/`)

- `esp32-board.svg` et `rm3100-sensor.svg` : planches de Fritzing **transparentes**, share le même `viewBox` (`38 18 224 172`) pour que les deux cartes décoratives de la zone Projets ait exactement la même taille ; elles sont posées sur un voile `bg-white/5` pour que le décor du monde reste visible derrière (pas de fond opaque).
- `esp32-chip.svg` et `rm3100-chip.svg` : **icônes 16 × 16 transparentes** utilisées dans la liste des compétences, pour rester alignées avec les `devicon` (le SVG complet de la planche aurait été rendu en 16 × 11 et aurait-filled la zone).

## 5. Accessibilité & mouvement réduit

- `prefers-reduced-motion: reduce` → **early-return** de tous les `init*()` : aucune animation, **contenu intégralement visible**.
- Sur `/cv` en reduced-motion, le monde passe en **layout empilé** (zones les unes sous les autres) au lieu de la piste horizontale ; l'hélico est affiché en position fixe (`animation: none`).
- `/cv` reste lisible **sans JavaScript** grâce au bloc `<noscript>` qui rend biographie, compétences, expériences, projets et contacts en HTML simple.
- Canvas et décors purement ornementaux sont `aria-hidden="true"` ; tout le contenu utile vit dans le DOM.
- Navigation clavier complète, focus visible, contrastes conformes AA sur fond `#05060d`.

## 6. Performance

- Animations restreintes à `transform` / `opacity` (pas de `filter: blur` ni de `background-position` animé).
- Parallaxe par `transform` uniquement (repaint par frame évité).
- `ScrollTrigger.refresh()` sur `load` après ajout/suppression de sections.
- Mesures du build courant : `dist` ≈ 5,6 Mo (assets inclus), `dist/client/_astro` ≈ 810 Ko, React ≈ 208 Ko, GSAP ≈ 68 Ko. `npm audit --omit=dev` : 0 vulnérabilité.
- Budgets à respecter : 60 fps desktop / ≥ 45 fps mobile, DPR clampé à 1,75, LCP < 2 s.

## 7. Déploiement (Cloudflare Workers)

```bash
npm run build
npx wrangler deploy
```

- `astro.config.mjs` déclare `adapter: cloudflare()` ; `wrangler.jsonc` pointe `main` sur `@astrojs/cloudflare/entrypoints/server` et sert `dist/` via le binding `ASSETS` (avec `Cache-Control` immuable injecté sur `/_astro/*`).
- L'observabilité est activée dans `wrangler.jsonc`.
- La route `src/pages/api/contact.ts` reste en SSR (`prerender = false`) : elle est indispensable à l'adaptateur Cloudflare.

## 8. Dette technique connue

- **PDF du CV (placeholder)** : `public/cv-tom-passerman.pdf.pdf` est un fichier de 9 octets servant de placeholder ; les liens de téléchargement (`src/pages/cv.astro` et `resumeData.pdfUrl`) pointent dessus. Il faut déposer le vrai PDF sous ce nom exact pour que le téléchargement soit exploitable.
- **Envoi d'e-mail non branché** : `src/pages/api/contact.ts` répond volontairement `501` et bascule vers un `mailto:` affiché à l'utilisateur (bandeau « MODE MAIL »). Brancher un service d'envoi suppose d'ajouter une variable d'environnement côté serveur, jamais exposée au client.
- **Contenu placeholder** : les valeurs de `src/data/stats.ts` et les libellés tronqués de `HudNavigation.astro` sont à remplacer par les données réelles.
- **Vérification de types** : `npm run check` (`@astrojs/check` + `typescript`) est câblé et passe à **0 erreur** sur les 51 fichiers ; à relancer après chaque modification de `.ts`/`.tsx`.
- **Boucles RAF isolées** : `Particles.tsx` et `PacketFirewallGame.tsx` ont leur propre `requestAnimationFrame` ; à migrer vers `gsap.ticker` lors d'une refonte (ne jamais créer de 4ᵉ boucle).
- `session: false` et `imageService` (optimisations Astro) sont des pistes d'amélioration non activées.

## 9. Conventions

Le détail des règles (vision, budgets, tiering, a11y, motion, nettoyage, checklist de livraison, dette connue) se trouve dans **`AGENTS.md`**. En résumé :

- scripts < ~120 lignes, composants < 300 lignes ;
- TypeScript strict, aucun `any` non justifié ;
- tout nouveau style passe par un token `@theme` ;
- classes conditionnelles via `cn()` (`src/lib/utils.ts`) ;
- nettoyage complet des tweens, ScrollTriggers, listeners et observers ;
- `npm run check` à 0 erreur et `npm run build` vert avant toute livraison.

---

© Tom Passerman — portfolio et CV interactif.
