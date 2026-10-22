# Règles de développement — Portfolio « monde 3D »

Références de direction : [samsy.ninja](https://samsy.ninja) (portfolio-monde navigable, pièces & transitions GSAP), [activetheory.net](https://activetheory.net) (discipline performance : LCP ~1.3 s, assets compressés, états fonctionnels).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## 1. Vision & principe cardinal

- **DOM-first, WebGL en couche** : le DOM est la source de vérité (SEO, accessibilité, no-JS). Le canvas 3D est une couche visuelle `aria-hidden` posée au-dessus, jamais l'inverse.
- Le site reste navigable et lisible : sans JS, sans WebGL/WebGPU, avec `prefers-reduced-motion`, et au clavier.
- La 3D sert le contenu, jamais l'inverse. Aucun effet qui repousse le contenu au-delà d'un scroll raisonnable.

## 2. Stack & dépendances

**Verrouillées** : Astro 7 · React 19 · TypeScript strict · Tailwind v4 **CSS-first** (tokens dans `@theme` de `src/styles/global.css`, aucun `tailwind.config.*`) · GSAP 3.15 (`ScrollTrigger`, `SplitText`) · Lenis · fonts `@fontsource-variable/inter` et `jetbrains-mono`.

**3D — seul ajout autorisé** : `three` + `@react-three/fiber` + `@react-three/drei` + `@types/three`. Toute autre dépendance doit être justifiée avant ajout.

**Interdits** :
- Une seule lib d'animation : **GSAP**. Ne jamais faire cohabiter `motion` (ou autre) pour des animations.
- Une seule boucle `requestAnimationFrame` principale : `gsap.ticker` pilote Lenis (`src/scripts/smooth-scroll.ts`). Les canvas isolés (`Particles.tsx`, `PacketFirewallGame.tsx`) ont leur propre RAF uniquement tant qu'ils ne sont pas migrés — jamais de 4ᵉ boucle.
- Pas de scroll-hijacking (cf. §7).

**Nettoyage effectué** : `motion` et `d3-force` ont été retirés de `package.json` (aucun import dans `src/`). Ne pas les réintroduire sans justification.

## 3. Architecture « monde »

```
src/three/            # scène 3D (Experience, Scene, pièces) — à créer
src/data/scene.ts     # registre des pièces → sections (à créer)
src/lib/capabilities.ts  # détection GPU/tier/motion (à créer)
src/scripts/          # orchestration : init*() GSAP appelés depuis Layout
src/components/       # structure DOM (Astro) + widgets interactifs (React)
src/data/             # contenu éditable (projects, stats, roles, network, scene)
```

- **Registre unique** `src/data/scene.ts` : chaque « pièce » correspond à une section existante (`#hero`, `#dev`, `#process`, `#governance`, `#contact`). Ajouter une section = 1 entrée ici + un `SectionShell` avec ses props `hash/message/zone`.
- State centralisé et fonctionnel (pattern Samsy) : pas de mutable global partagé, un seul store/contexte pour l'état de la scène et des transitions.
- Séparation stricte des responsabilités : Astro = structure & contenu ; React (`client:*`) = widgets ; `src/three` = rendu ; `src/scripts` = animation.

## 4. Budgets de performance (contraintes mesurables)

- 60 fps desktop / ≥ 45 fps mobile — mesurer, pas supposer.
- DPR clampé : `Math.min(devicePixelRatio, 1.75)` — **1 canvas maximum** par page.
- Modèles `.glb` compressés **Draco ou meshopt**, textures **KTX2/Basis** ; GLB ≤ 2 Mo, budget total 3D ≤ 5 Mo.
- Ombrage *baked* dans les textures : pas de shadow maps temps réel, pas de lumières dynamiques multiples.
- `InstancedMesh`/shaders pour tout ce qui dépasse ~100 exemplaires ; pool d'objets, **zéro allocation par frame**.
- Chargement par pièce (`Suspense`, `useGLTF.preload`) : jamais de chargement du monde entier au démarrage.
- RAF en pause si onglet masqué (`visibilitychange`) ou canvas hors viewport (`IntersectionObserver`).
- Motion uniquement via `transform` / `opacity` / `clip-path` ; `will-change` seulement pendant l'animation ; pas de `filter: blur` massif en mouvement.
- LCP < 2 s ; toute dépendance qui grossit le bundle > 20 Ko gzip doit être justifiée.

## 5. Tiering adaptatif — 3 niveaux

Détection centralisée dans `src/lib/capabilities.ts`, évaluée une fois au démarrage :

- **high** : WebGPU si `navigator.gpu`, sinon WebGL2 + postprocessing léger, DPR ≤ 1.75.
- **basic** : WebGL2 simplifié — pas de postprocessing, DPR ≤ 1.25, géométrie réduite.
- **static** : aucun canvas — version DOM seule.

Forcé **static** quand l'une de ces conditions est vraie : `prefers-reduced-motion: reduce`, absence de `navigator.gpu` **et** de WebGL2, `navigator.deviceMemory < 4`, ou tiering mobile bas détecté.

Dégradation toujours dans le sens riche → sobre, **jamais** d'erreur affichée à l'utilisateur.

## 6. Accessibilité & SEO

- Chaque animation possède un fallback `prefers-reduced-motion` affichant l'**état final visible** (modèle : early-return dans les `init*()` de `src/scripts/`).
- Canvas : `aria-hidden="true"` ; tout le contenu réel vit dans le DOM (le SEO ne voit pas la 3D).
- Navigation clavier complète (sections, onglets, filtres, pièces) ; aucun piège de focus ; `tabindex` seulement sur widgets interactifs ; focus visible.
- Contrastes WCAG AA sur fond `#05060d` (texte secondaire minimum `slate-400`, idéal `slate-300`).
- 100 % lisible sans JS : aucun contenu essentiel produit uniquement par React ou la 3D ; pas de texte embarqué dans les images.

## 7. Motion & scroll

- Conventions existantes à respecter : `init*()` exportés par `src/scripts/*.ts` et appelés depuis `Layout.astro` ; cibles via attributs `data-*` (**jamais** une classe CSS comme sélecteur JS) ; `prefersReducedMotion()` importé de `src/lib/motion.ts` en early-return.
- `gsap.registerPlugin(ScrollTrigger)` reste centralisé dans `src/lib/motion.ts` (`ScrollToPlugin`, propre au CV, dans `cv-world.ts`) ; `SplitText` dans `reveal.ts`.
- Entrées → `once: true` ; scroll-driven → `scrub` ou `onUpdate` ; Lenis `lerp ≤ 0.12` ; **aucun scroll-hijacking** (ne jamais bloquer molette/espace/flèches).
- Durées : micro-interactions 0.15–0.2 s, entrées 0.5–0.9 s ; easing `power3.out` par défaut, `back.out(2)` pour les snaps.
- SplitText réservé aux titres `[data-reveal-title]` ; le typewriter est réservé au hero.
- Parallaxe CV : les calques `.world-layer` sont dimensionnés `calc(100% + var(--world-w))` (largeur du monde exposée par `InteractiveWorld.astro`) et déplacés par `transform` via `moveLayers()` (`cv-world.ts`). Ne jamais repasser à `background-position` (repaint par frame, §4) ni à une largeur auto (calque invisible) ; en `prefers-reduced-motion` la parallaxe est figée (`transform: none`).
- Après ajout/suppression d'une section : `ScrollTrigger.refresh()` sur `load` (déjà en place) et vérifier `src/scripts/timeline.ts` (variable `--gov`).

## 8. Qualité de code

- TypeScript strict, aucun `any` non justifié ; types de contenu partagés dans `src/data/*.ts`.
- Hydatration : `client:visible` par défaut ; `client:load` réservé (Particles, scène 3D si ajoutée).
- Nettoyage complet obligatoire : tweens et ScrollTriggers (`kill()`), listeners, observers.
- Composants < 300 lignes ; scripts < ~120 lignes sinon découper.
- Tout style nouveau = token `@theme` (pas de couleur/valeur en dur hors tokens) ; classes conditionnelles via `cn()` (`src/lib/utils.ts`).
- Pas de commentaires de code superflus ; nommage FR/EN cohérent avec le fichier existant.

## 9. Assets & déploiement

- `public/models/*.glb`, `public/textures/*.ktx2`, `public/projects/*.svg` — noms en kebab-case.
- Screenshots/illustrations : WebP, largeur max 1600 px.
- Déploiement Cloudflare (Wrangler) ; toute route `prerender = false` exige l'adapter Cloudflare (voir §11).

## 10. Checklist de livraison (fin de chaque session)

1. `astro dev --background` → **0 erreur console** au chargement et au scroll complet.
2. `prefers-reduced-motion: reduce` activé → tout visible, rien d'animé.
3. JS désactivé → contenu complet lisible.
4. Viewport 375 px → pas de débordement horizontal (hors rail timeline assumé).
5. Clavier : Tab traverse CTA, onglets et filtres ; focus visible.
6. `npm run build` vert (une fois la dette §11 résolue).
7. Budgets §4 respectés (DPR, poids assets, fps).

## 11. Dette technique connue

- **`npm run build` est vert** : `adapter: cloudflare()` est rétabli dans `astro.config.mjs`, la route `src/pages/api/contact.ts` reste en SSR (`prerender = false`).
- **Envoi d'e-mail non branché** : `src/pages/api/contact.ts` répond volontairement `501` avec un lien `mailto:` — aucun secret ni service tiers n'est exposé. Le client (`ContactTerminal.tsx`, `cv-contact.ts`) bascule sur ce `mailto:` et l'affiche à l'utilisateur (bandeau « ● MODE MAIL »). Brancher un vrai service d'envoi suppose d'ajouter la variable d'environnement correspondante et de ne jamais l'exposer côté client.
- `Particles.tsx` et `PacketFirewallGame.tsx` possèdent leur propre RAF → à migrer sur `gsap.ticker` lors d'une refonte, sinon les garder isolés (jamais d'une nouvelle boucle).
