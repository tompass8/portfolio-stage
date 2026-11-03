---
name: Tom Passerman — Portfolio
description: Portfolio d'un étudiant développeur, lu comme la signalétique d'un aérogare.
colors:
  sign-yellow: "#ffcc00"
  sign-yellow-press: "#f0bd00"
  sign-black: "#0b0b0b"
  ink-on-yellow: "#4a3d00"
  board-black: "#111111"
  flap-gray: "#232323"
  flap-yellow: "#ffcc00"
  concrete: "#ebebe8"
  panel-white: "#ffffff"
  rule-gray: "#c9c9c4"
  muted-ink: "#55554f"
  board-text: "#e6e6e6"
  board-muted: "#a3a3a3"
typography:
  gate:
    fontFamily: "Source Sans 3 Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(5rem, 11vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Source Sans 3 Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Source Sans 3 Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Sans 3 Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Source Sans 3 Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  board:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  tag: "4px"
  panel: "6px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  section: "64px"
components:
  sign-band:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
  sign-link-current:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.sign-yellow}"
    rounded: "{rounded.panel}"
  gate:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "28px"
  gate-hover:
    backgroundColor: "{colors.sign-yellow-press}"
  picto:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.panel}"
    size: "48px"
  panel:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "32px"
  tag:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.sign-yellow}"
    rounded: "{rounded.tag}"
    padding: "4px 12px"
  board-cell:
    backgroundColor: "{colors.flap-gray}"
    textColor: "{colors.board-text}"
    typography: "{typography.board}"
    rounded: "{rounded.tag}"
---

# Design System: Tom Passerman — Portfolio

## Overview

**Creative North Star: "Le terminal de correspondance"**

Le visiteur est un voyageur pressé entre deux vols : il ne doit voir que la prochaine décision. Le site emprunte la grammaire des systèmes de signalétique aéroportuaire (panneaux jaunes suspendus, pictogrammes blancs sur carré noir, numéros de porte monumentaux, tableau des départs) et l'applique à un portfolio : les projets sont des portes, le parcours est un tableau des départs, le contact est la sortie.

La personnalité vient de la discipline, pas des effets. Fond béton clair et neutre pour lire, jaune réservé à l'orientation, noir pour le cadre et les pictogrammes. Aucune lueur, aucun dégradé, aucun fond animé : la direction rejette explicitement le look « néon cyan/violet sur quasi-noir » de la version précédente, jugé trop « généré par IA ».

**Key Characteristics:**
- Jaune en champs entiers (bandeau, portes, actions), jamais en filet décoratif.
- Pictogrammes géométriques dessinés à la main, trait unique, blanc sur noir.
- Chiffres de porte monumentaux quand le numéro porte une information.
- Données tabulaires en mono, uniquement sur le tableau des départs et le code.

## Colors

Une couleur d'orientation, un noir de signalétique, des neutres de terminal.

### Primary
- **Jaune balise** (sign-yellow) : bandeau d'orientation collant, portes du premier écran, en-têtes de section, actions principales (e-mail). Survol et pression : **Jaune pressé** (sign-yellow-press).

### Neutral
- **Noir signalétique** (sign-black) : texte, carrés de pictogrammes, cadres de 6 px, étiquettes, état « destination suivie » du bandeau.
- **Encre sur jaune** (ink-on-yellow) : texte secondaire posé sur le jaune (contraste ≈ 7,8:1), teinté du jaune plutôt que gris.
- **Noir tableau** (board-black) et **Volet** (flap-gray) : tableau des départs et blocs de code ; texte **Clair tableau** (board-text), secondaire **Gris tableau** (board-muted), valeurs en **Jaune volet** (flap-yellow).
- **Béton** (concrete) : fond de page, sol du terminal où l'on lit.
- **Blanc panneau** (panel-white) : surfaces de contenu (schémas, annuaire, démos).
- **Encre atténuée** (muted-ink) : texte secondaire sur béton ou blanc (≈ 6:1). **Filet** (rule-gray) : séparateurs.

### Named Rules
**The Wayfinding-Only Rule.** Le jaune signale où aller ou quoi faire : bandeau, portes, en-têtes, action principale. Il n'habille jamais un paragraphe ou une décoration.

**The No-Glow Rule.** Aucune lueur, ombre colorée ni dégradé. Le contraste vient des aplats.

## Typography

**Display Font:** Source Sans 3 Variable (avec Segoe UI, system-ui)
**Body Font:** Source Sans 3 Variable
**Label/Mono Font:** JetBrains Mono Variable, réservée aux données (tableau des départs, architecture, code)

**Character:** Une sans humaniste de signalétique (lignée Frutiger, conçue pour un aéroport parisien), en casse phrase, grasse et serrée en titre, ouverte et calme en texte.

### Hierarchy
- **Gate** (700, clamp(5rem, 11vw, 9.5rem), 0.82) : numéros de porte des projets et parts 75 % / 25 %.
- **Display** (700, clamp(2.75rem, 6vw, 5.5rem), 0.95) : h1 de page.
- **Headline** (700, 3rem, 1) : titres des panneaux de section.
- **Title** (700, 1.5rem, 1.25) : titres de bloc, noms d'entreprise et de famille de compétences.
- **Body** (400, 1.0625rem à 1.25rem, 1.625) : texte courant, mesure ≤ 40rem.
- **Board** (400, 1.125rem, 0.08em, capitales) : cellules du tableau des départs.

### Named Rules
**The Sentence-Case Rule.** Titres et libellés en casse phrase, comme sur un panneau ; les capitales sont réservées au tableau des départs.

## Layout

Conteneur de 90rem centré, gouttière de 16 px (24 px dès 640 px). Chaque section s'ouvre par un panneau suspendu pleine largeur (bordures noires de 6 px en haut et en bas), suivi d'un contenu en 64 px de respiration verticale. Premier écran : identité, puis trois portes en grille de trois colonnes (une sur mobile). Fiches projets en deux colonnes 5/7, la porte collante à gauche dès 1024 px. Sous 640 px, le tableau des départs empile chaque ligne en carte de trois rangs. Le bandeau défile horizontalement sur mobile plutôt que de passer en menu.

## Elevation & Depth

Système entièrement plat. La profondeur vient de l'empilement d'aplats (béton → blanc → jaune → noir) et des cadres noirs épais, jamais d'ombres portées. Seul mouvement : la mise à jour en volet du tableau des départs à sa première apparition (rotation X de 90° à 0°, 420 ms, décalage de 45 ms par cellule), désactivée en mouvement réduit.

### Named Rules
**The Flat-Panel Rule.** Un panneau est un aplat. S'il doit se détacher, il change de couleur de fond, pas d'ombre.

## Shapes

Coins à peine adoucis, comme un panneau en aluminium : 6 px pour les panneaux, portes et carrés de pictogrammes, 4 px pour les étiquettes et cellules. Traits noirs épais (3 à 6 px) pour les séparations structurelles, filets de 2 px pour les listes. Les lignes de flux (architecture, méthode) sont dessinées comme des lignes de plan : barre noire de 6 px, arrêts en anneaux.

## Components

### Bandeau d'orientation
Collant en haut, jaune, bordure basse noire de 6 px. Chaque entrée : pictogramme + destination. Survol : jaune pressé. La destination de la section visible passe en noir avec texte jaune (`aria-current`).

### Porte
Lien pleine carte jaune : numéro monumental en haut, nom et ligne descriptive en bas, flèche dans un carré noir calée sur le bord inférieur droit. Survol : jaune pressé, la flèche glisse de 4 px dans sa direction.

### Pictogramme
Carré noir 36/48/80 px, glyphe SVG blanc au trait de 2,6 (extrémités carrées). Jamais d'émoji ni de caractère Unicode à la place.

### Tableau des départs
Vraie table : Période (jaune), Escale, Poste. Fond noir, cellules gris volet séparées de 8 px, mono en capitales.

### Panneau de contenu
Blanc, 6 px de rayon, 20 à 32 px de marge interne, sans bordure ni ombre. Les sous-éléments se séparent par des filets béton, jamais par des cartes imbriquées.

### Étiquettes
Statut, niveau, accès : noir sur jaune (fort) ou contour noir de 2 px (neutre) ; « isolé » en contour pointillé.

## Do's and Don'ts

### Do:
- **Do** réserver le jaune (#ffcc00) à l'orientation et à l'action principale.
- **Do** mettre l'adresse e-mail en clair dans l'action de contact.
- **Do** dessiner les architectures comme des lignes de plan à partir des données réelles.
- **Do** garder le texte secondaire teinté du fond (encre sur jaune, encre atténuée), contraste ≥ 4,5:1.

### Don't:
- **Don't** réintroduire les lueurs, dégradés, fonds animés ou la palette néon cyan/violet.
- **Don't** poser un surtitre (kicker) au-dessus d'un titre : l'information passe en étiquette après le titre.
- **Don't** utiliser la mono pour faire « technique » : seulement pour les données et le code.
- **Don't** imbriquer des cartes dans des cartes.
- **Don't** illustrer un projet avec une photo de banque d'images ; capture réelle ou ligne de flux.
