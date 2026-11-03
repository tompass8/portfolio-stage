# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruteurs et tuteurs de stage / alternance** qui évaluent un étudiant en informatique : ils arrivent depuis un lien de candidature, parcourent vite, veulent juger le niveau technique réel et le sérieux, puis contacter.
- **L'équipe Alpha to Omega (A2Ω, Toulouse)** en particulier : cabinet qui fait ~75 % d'ingénierie web sur mesure et ~25 % de gouvernance numérique. Ils lisent la candidature dédiée.

## Product Purpose

Portfolio personnel de Tom Passerman, étudiant B.Sc. Informatique à Ynov Campus Toulouse. Le site sert à la fois de portfolio général réutilisable pour d'autres candidatures (stage, alternance) et de candidature dédiée à Alpha to Omega (stage 2 à 6 mois, dispo immédiate). Succès : le visiteur comprend en quelques secondes qui est Tom et ce qu'il sait faire, voit des preuves concrètes, et le contacte.

## Positioning

Un étudiant qui a déjà fait tourner des systèmes réels (Orange : automatisation des déploiements ; ITL : administration systèmes & réseaux, vidéosurveillance IP) et qui couvre à la fois le développement web/API, l'IoT et la gouvernance IT (cartographie SI, IAM, RGPD). Le site lui-même est une démonstration : construit avec Astro, déployé sur Cloudflare, co-construit avec l'IA mais relu et vérifié à la main.

## Operating Context

- Lu sur desktop par un recruteur, souvent entre deux autres candidatures ; aussi ouvert sur mobile depuis un e-mail ou LinkedIn.
- Deux routes : `/` (site principal / candidature) et `/cv` (CV interactif en monde pixel à défilement horizontal).
- Contact réel par e-mail (`mailto:`) ; l'envoi serveur n'est pas branché.

## Capabilities and Constraints

- Stack existante conservée : Astro 7, React 19 (widgets), Tailwind v4 CSS-first, GSAP, Lenis, déploiement Cloudflare. Règles détaillées dans `portfolio/AGENTS.md`.
- **À conserver (fonction et contenu, le look peut changer)** :
  - la page `/cv` en jeu pixel (monde horizontal, avatar, zones) ;
  - les démos gouvernance : schéma réseau cliquable, matrice IAM, cadenas RGPD ;
  - tous les textes actuels ; toute réécriture nécessaire à une nouvelle structure se valide avec Tom avant.
- **Non conservé d'office** : le mini-jeu WAF (`PacketFirewallGame`) n'a pas été retenu dans la liste à garder.
- Contenu lisible sans JS, au clavier et en `prefers-reduced-motion`.
- Ouvert : comment le portfolio général et la candidature A2Ω se partagent la structure (page dédiée, bloc, variante).

## Brand Commitments

- Ne doit pas faire « site généré par IA » : Tom rejette la palette actuelle (néon cyan/violet sur quasi-noir, lueurs) pour cette raison.
- Doit sentir l'étudiant dev passionné, **pas corporate** ni agence.
- **Du mouvement, pas de l'esbroufe** : Tom veut des animations (apparitions au défilement, survols, intro en borne d'arcade sur le CV), mais toujours sans lueurs ni fonds animés, et désactivées en mouvement réduit.

## Evidence on Hand

- Projets réels : Le Gourmand (Express/MySQL/Docker), YMMO (Vue 3, .NET 10, FastAPI, 2M de biens), SPARK (IoT ESP32/ESP-NOW) — données dans `portfolio/src/data/projects.ts`, captures dans `portfolio/public/projects/`.
- Expériences : ITL (2025–2026, admin systèmes & réseaux), Orange (juillet–août 2023, support IT & admin systèmes) — `portfolio/src/data/resumeData.ts`.
- Liens : GitHub `tompass8`, LinkedIn `tom-passerman`, e-mail `tompasserman5@gmail.com`.
- Assets pixel du CV (sprites joueur, décors, props) dans `portfolio/public/assets/`.
- Absents, à ne pas inventer : témoignages, chiffres de performance non mesurés, clients, liens de démo en ligne des projets.

## Product Principles

1. Prouver plutôt qu'affirmer : chaque compétence s'appuie sur un projet, une expérience ou une démo réelle.
2. Lisible en trente secondes par un recruteur pressé, sans sacrifier la profondeur pour qui creuse.
3. Le site est lui-même un échantillon de travail : sobre, rapide, accessible, fait à la main.
4. La personnalité vient du contenu et des détails, pas des effets.

## Accessibility & Inclusion

WCAG AA : contrastes, navigation clavier complète, focus visible, fallback `prefers-reduced-motion` avec état final visible, contenu complet sans JS.
