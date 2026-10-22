// src/data/stats.ts — statistiques affichées dans la bande « En chiffres »
// Valeurs placeholders : à remplacer par vos vrais chiffres.
export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 1200, suffix: "+", label: "Heures de développement" },
  { value: 24, suffix: "", label: "Projets & exercices livrés" },
  { value: 15, suffix: "", label: "Technologies maîtrisées" },
];
