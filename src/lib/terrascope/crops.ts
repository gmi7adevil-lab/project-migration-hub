import { matchesQuery } from "./text";
import type { RegionName } from "./regions";

export type CropCategory = "cereal" | "vegetable" | "legume" | "fruit" | "aromatic" | "fodder";

export const CROP_CATEGORY_LABEL: Record<CropCategory, string> = {
  cereal: "Céréales",
  vegetable: "Légumes",
  legume: "Légumineuses",
  fruit: "Arbres fruitiers",
  aromatic: "Plantes aromatiques",
  fodder: "Fourrages",
};

export const CROP_CATEGORIES = Object.keys(CROP_CATEGORY_LABEL) as CropCategory[];

export type CropIcon =
  | "wheat"
  | "sprout"
  | "cherry"
  | "carrot"
  | "salad"
  | "leafy"
  | "bean"
  | "leaf"
  | "vegan"
  | "tree"
  | "palm"
  | "citrus"
  | "flower"
  | "clover"
  | "shrub";

export interface Crop {
  id: string;
  fr: string;
  en: string;
  category: CropCategory;
  icon: CropIcon;
  description: string;
  growing: string;
  water: string;
  sowing: string;
  harvest: string;
  /**
   * Regions widely known as production areas for this crop (general agricultural knowledge).
   * Indicative only — not a verified agronomic recommendation for a given plot.
   */
  knownRegions: RegionName[];
}

export const CROPS: Crop[] = [
  // ---- Céréales ----
  {
    id: "ble-tendre",
    fr: "Blé tendre",
    en: "Soft wheat",
    category: "cereal",
    icon: "wheat",
    description: "Céréale la plus cultivée au Maroc, base de la farine et du pain.",
    growing: "Culture d'hiver, majoritairement pluviale (bour), sur sols profonds et bien drainés.",
    water: "Pluvial, irrigation d'appoint possible",
    sowing: "Novembre – décembre",
    harvest: "Mai – juin",
    knownRegions: ["Casablanca-Settat", "Fès-Meknès", "Rabat-Salé-Kénitra", "Marrakech-Safi"],
  },
  {
    id: "ble-dur",
    fr: "Blé dur",
    en: "Durum wheat",
    category: "cereal",
    icon: "wheat",
    description: "Destiné à la semoule, au couscous et aux pâtes alimentaires.",
    growing: "Culture d'hiver des plaines semi-arides ; sensible à l'humidité en fin de cycle.",
    water: "Pluvial, irrigation d'appoint possible",
    sowing: "Novembre – décembre",
    harvest: "Mai – juin",
    knownRegions: ["Casablanca-Settat", "Fès-Meknès", "Rabat-Salé-Kénitra", "Béni Mellal-Khénifra"],
  },
  {
    id: "orge",
    fr: "Orge",
    en: "Barley",
    category: "cereal",
    icon: "wheat",
    description: "Céréale rustique pour l'alimentation humaine et animale.",
    growing: "Tolère mieux la sécheresse et les sols pauvres que le blé ; très présente en zones arides.",
    water: "Pluvial, faibles besoins",
    sowing: "Octobre – décembre",
    harvest: "Avril – mai",
    knownRegions: ["Marrakech-Safi", "Casablanca-Settat", "L'Oriental", "Béni Mellal-Khénifra"],
  },
  {
    id: "mais",
    fr: "Maïs",
    en: "Corn",
    category: "cereal",
    icon: "sprout",
    description: "Céréale d'été cultivée pour le grain et le fourrage (ensilage).",
    growing: "Culture de printemps-été exigeante en chaleur, conduite en irrigué.",
    water: "Irrigué, besoins élevés",
    sowing: "Mars – mai",
    harvest: "Août – octobre",
    knownRegions: ["Rabat-Salé-Kénitra", "Béni Mellal-Khénifra", "Casablanca-Settat"],
  },
  {
    id: "avoine",
    fr: "Avoine",
    en: "Oats",
    category: "cereal",
    icon: "wheat",
    description: "Principalement cultivée comme fourrage pour l'élevage.",
    growing: "Culture d'hiver qui apprécie les zones fraîches et humides.",
    water: "Pluvial",
    sowing: "Octobre – novembre",
    harvest: "Avril – juin",
    knownRegions: ["Rabat-Salé-Kénitra", "Fès-Meknès", "Tanger-Tétouan-Al Hoceïma"],
  },
  {
    id: "riz",
    fr: "Riz",
    en: "Rice",
    category: "cereal",
    icon: "sprout",
    description: "Culture localisée, conduite en submersion dans les plaines irriguées.",
    growing: "Sols argileux et grande disponibilité en eau ; surfaces limitées au Maroc.",
    water: "Submersion, besoins très élevés",
    sowing: "Avril – mai",
    harvest: "Septembre – octobre",
    knownRegions: ["Rabat-Salé-Kénitra"],
  },
  // ---- Légumes ----
  {
    id: "pommes-de-terre",
    fr: "Pommes de terre",
    en: "Potatoes",
    category: "vegetable",
    icon: "vegan",
    description: "Culture maraîchère majeure, consommée toute l'année.",
    growing: "Sols légers et meubles ; plusieurs cycles par an (primeur, saison, arrière-saison).",
    water: "Irrigation régulière",
    sowing: "Plantation de décembre à mars, ou août – septembre",
    harvest: "3 à 4 mois après plantation",
    knownRegions: ["Fès-Meknès", "Casablanca-Settat", "Rabat-Salé-Kénitra", "Souss-Massa"],
  },
  {
    id: "tomates",
    fr: "Tomates",
    en: "Tomatoes",
    category: "vegetable",
    icon: "cherry",
    description: "Légume phare du maraîchage marocain, marché local et export.",
    growing: "Plein champ au printemps-été ou sous serre ; besoin de chaleur et d'irrigation.",
    water: "Irrigation goutte-à-goutte courante",
    sowing: "Plein champ : mars – mai · Serre : août – octobre",
    harvest: "Plein champ : juin – septembre · Serre : novembre – mai",
    knownRegions: ["Souss-Massa", "Dakhla-Oued Ed-Dahab", "Rabat-Salé-Kénitra", "Casablanca-Settat"],
  },
  {
    id: "oignons",
    fr: "Oignons",
    en: "Onions",
    category: "vegetable",
    icon: "vegan",
    description: "Légume de base de la cuisine marocaine.",
    growing: "Sols bien drainés ; arrêt de l'irrigation quelques semaines avant récolte.",
    water: "Irrigation modérée",
    sowing: "Repiquage : novembre – février",
    harvest: "Avril – juillet",
    knownRegions: ["Fès-Meknès", "Béni Mellal-Khénifra", "Marrakech-Safi", "Casablanca-Settat"],
  },
  {
    id: "carottes",
    fr: "Carottes",
    en: "Carrots",
    category: "vegetable",
    icon: "carrot",
    description: "Racine cultivée principalement pour le marché frais.",
    growing: "Sols profonds, sableux à limoneux et sans cailloux.",
    water: "Irrigation régulière",
    sowing: "Semis : septembre – mars",
    harvest: "3 à 4 mois après le semis",
    knownRegions: ["Casablanca-Settat", "Fès-Meknès", "Rabat-Salé-Kénitra"],
  },
  {
    id: "poivrons",
    fr: "Poivrons",
    en: "Peppers",
    category: "vegetable",
    icon: "leaf",
    description: "Légume-fruit pour le marché local et l'export.",
    growing: "Culture de saison chaude, souvent sous serre ; sensible au froid.",
    water: "Irrigation goutte-à-goutte",
    sowing: "Plein champ : février – mai · Serre : août – septembre",
    harvest: "Plein champ : juin – novembre · Serre : hiver",
    knownRegions: ["Souss-Massa", "Casablanca-Settat"],
  },
  {
    id: "courgettes",
    fr: "Courgettes",
    en: "Zucchini",
    category: "vegetable",
    icon: "leafy",
    description: "Cycle court et production rapide.",
    growing: "Chaleur modérée ; culture de plein champ ou sous abri.",
    water: "Irrigation régulière",
    sowing: "Semis : février – avril et septembre – octobre",
    harvest: "45 à 60 jours après le semis",
    knownRegions: ["Souss-Massa", "Casablanca-Settat", "Rabat-Salé-Kénitra"],
  },
  {
    id: "aubergines",
    fr: "Aubergines",
    en: "Eggplants",
    category: "vegetable",
    icon: "leaf",
    description: "Légume-fruit de climat chaud.",
    growing: "Exigeante en chaleur ; préfère les sols riches en matière organique.",
    water: "Irrigation régulière",
    sowing: "Plantation : mars – mai",
    harvest: "Juin – octobre",
    knownRegions: ["Souss-Massa", "Casablanca-Settat"],
  },
  {
    id: "laitue",
    fr: "Laitue",
    en: "Lettuce",
    category: "vegetable",
    icon: "salad",
    description: "Légume-feuille à cycle court.",
    growing: "Préfère les températures fraîches ; irrigation fréquente et légère.",
    water: "Irrigation fréquente",
    sowing: "Plantation : septembre – mars",
    harvest: "6 à 10 semaines après plantation",
    knownRegions: ["Casablanca-Settat", "Rabat-Salé-Kénitra"],
  },
  {
    id: "choux",
    fr: "Choux",
    en: "Cabbage",
    category: "vegetable",
    icon: "leafy",
    description: "Légume d'hiver robuste et productif.",
    growing: "Climat frais, sols fertiles et bien pourvus en eau.",
    water: "Irrigation régulière",
    sowing: "Plantation : août – novembre",
    harvest: "Novembre – mars",
    knownRegions: ["Casablanca-Settat", "Fès-Meknès", "Rabat-Salé-Kénitra"],
  },
  {
    id: "haricots-verts",
    fr: "Haricots verts",
    en: "Green beans",
    category: "vegetable",
    icon: "bean",
    description: "Culture importante pour l'export de primeurs.",
    growing: "Sensible au gel ; souvent cultivé sous serre en hiver.",
    water: "Irrigation goutte-à-goutte",
    sowing: "Serre : septembre – novembre · Plein champ : mars – avril",
    harvest: "2 à 3 mois après le semis",
    knownRegions: ["Souss-Massa", "Rabat-Salé-Kénitra"],
  },
  {
    id: "concombres",
    fr: "Concombres",
    en: "Cucumbers",
    category: "vegetable",
    icon: "leafy",
    description: "Légume-fruit à croissance rapide.",
    growing: "Chaleur et humidité ; culture fréquente sous serre.",
    water: "Irrigation régulière",
    sowing: "Serre : septembre – octobre · Plein champ : mars – mai",
    harvest: "50 à 70 jours après plantation",
    knownRegions: ["Souss-Massa", "Casablanca-Settat"],
  },
  {
    id: "petits-pois",
    fr: "Petits pois",
    en: "Green peas",
    category: "vegetable",
    icon: "bean",
    description: "Légumineuse de saison fraîche qui enrichit le sol en azote.",
    growing: "Climat frais, sols bien drainés ; peu exigeante en engrais azotés.",
    water: "Pluvial ou irrigation d'appoint",
    sowing: "Semis : octobre – janvier",
    harvest: "Février – mai",
    knownRegions: ["Casablanca-Settat", "Fès-Meknès", "Rabat-Salé-Kénitra"],
  },
  // ---- Légumineuses ----
  {
    id: "pois-chiche",
    fr: "Pois chiche",
    en: "Chickpea",
    category: "legume",
    icon: "bean",
    description: "Légumineuse sèche très consommée, qui enrichit le sol en azote.",
    growing: "Culture de printemps ou d'hiver en bour, sur sols profonds ; tolère bien la sécheresse.",
    water: "Pluvial, faibles besoins",
    sowing: "Décembre (hiver) ou janvier – mars (printemps)",
    harvest: "Juin – juillet",
    knownRegions: ["Fès-Meknès", "Rabat-Salé-Kénitra", "Casablanca-Settat", "Marrakech-Safi"],
  },
  {
    id: "lentille",
    fr: "Lentille",
    en: "Lentil",
    category: "legume",
    icon: "bean",
    description: "Légumineuse riche en protéines, cultivée en bour dans les plaines céréalières.",
    growing: "Culture d'hiver sur sols limoneux à argileux bien drainés ; s'insère en rotation avec les céréales.",
    water: "Pluvial, faibles besoins",
    sowing: "Novembre – janvier",
    harvest: "Mai – juin",
    knownRegions: ["Fès-Meknès", "Casablanca-Settat", "Rabat-Salé-Kénitra"],
  },
  {
    id: "feve",
    fr: "Fève",
    en: "Faba bean",
    category: "legume",
    icon: "bean",
    description: "Légumineuse consommée fraîche ou sèche, également utilisée en alimentation animale.",
    growing: "Culture d'hiver de climat frais ; améliore la structure et la fertilité du sol.",
    water: "Pluvial, irrigation d'appoint possible",
    sowing: "Octobre – décembre",
    harvest: "Mars – juin",
    knownRegions: ["Fès-Meknès", "Tanger-Tétouan-Al Hoceïma", "Rabat-Salé-Kénitra", "Casablanca-Settat"],
  },
  // ---- Arbres fruitiers ----
  {
    id: "olivier",
    fr: "Olivier",
    en: "Olive tree",
    category: "fruit",
    icon: "tree",
    description: "Arbre emblématique du Maroc, cultivé pour l'huile et l'olive de table.",
    growing: "Arbre rustique adapté aux climats semi-arides ; entre en production après 3 à 5 ans.",
    water: "Pluvial possible, irrigation d'appoint pour un meilleur rendement",
    sowing: "Plantation : novembre – mars",
    harvest: "Octobre – janvier",
    knownRegions: ["Fès-Meknès", "Marrakech-Safi", "L'Oriental", "Béni Mellal-Khénifra", "Tanger-Tétouan-Al Hoceïma"],
  },
  {
    id: "amandier",
    fr: "Amandier",
    en: "Almond tree",
    category: "fruit",
    icon: "shrub",
    description: "Arbre fruitier rustique des zones sèches et de montagne.",
    growing: "Résiste à la sécheresse mais craint les gelées tardives à la floraison ; production après 3 à 4 ans.",
    water: "Pluvial, irrigation d'appoint conseillée",
    sowing: "Plantation : décembre – février",
    harvest: "Juillet – septembre",
    knownRegions: ["Souss-Massa", "Drâa-Tafilalet", "Marrakech-Safi", "L'Oriental", "Fès-Meknès"],
  },
  {
    id: "palmier-dattier",
    fr: "Palmier dattier",
    en: "Date palm",
    category: "fruit",
    icon: "palm",
    description: "Culture des oasis, base de l'économie agricole du Sud.",
    growing: "Exige une forte chaleur et une irrigation régulière ; production après 4 à 6 ans.",
    water: "Irrigué, besoins élevés",
    sowing: "Plantation : mars – mai",
    harvest: "Septembre – novembre",
    knownRegions: ["Drâa-Tafilalet", "Souss-Massa", "Guelmim-Oued Noun"],
  },
  {
    id: "figuier-barbarie",
    fr: "Figuier de Barbarie",
    en: "Prickly pear",
    category: "fruit",
    icon: "leaf",
    description: "Cactus fruitier très résistant à la sécheresse, valorisé pour ses fruits, ses graines et comme fourrage.",
    growing: "Pousse sur sols pauvres en zones arides et aide à lutter contre l'érosion ; production après 2 à 3 ans.",
    water: "Pluvial, très faibles besoins",
    sowing: "Plantation : février – avril",
    harvest: "Juillet – septembre",
    knownRegions: ["Guelmim-Oued Noun", "Marrakech-Safi", "Souss-Massa", "Casablanca-Settat"],
  },
  {
    id: "agrumes",
    fr: "Agrumes",
    en: "Citrus",
    category: "fruit",
    icon: "citrus",
    description: "Oranges, clémentines et citrons pour le marché local et l'export.",
    growing: "Verger irrigué de climat doux, sensible au gel ; production après 3 à 4 ans.",
    water: "Irrigué, besoins élevés (goutte-à-goutte)",
    sowing: "Plantation : février – avril",
    harvest: "Novembre – avril",
    knownRegions: ["Souss-Massa", "L'Oriental", "Béni Mellal-Khénifra", "Rabat-Salé-Kénitra", "Marrakech-Safi"],
  },
  // ---- Plantes aromatiques ----
  {
    id: "menthe",
    fr: "Menthe",
    en: "Mint",
    category: "aromatic",
    icon: "leafy",
    description: "Plante aromatique très demandée pour le thé, vendue fraîche toute l'année.",
    growing: "Culture pérenne en sol frais, coupée plusieurs fois par an ; demande beaucoup de main-d'œuvre.",
    water: "Irrigation fréquente",
    sowing: "Plantation : février – avril ou septembre – octobre",
    harvest: "Coupes de mars à novembre",
    knownRegions: ["Casablanca-Settat", "Rabat-Salé-Kénitra", "Marrakech-Safi", "Fès-Meknès"],
  },
  {
    id: "safran",
    fr: "Safran",
    en: "Saffron",
    category: "aromatic",
    icon: "flower",
    description: "Épice de très haute valeur, cultivée surtout autour de Taliouine.",
    growing: "Bulbes (cormes) plantés en été, floraison en automne ; récolte manuelle des stigmates.",
    water: "Faibles besoins, quelques irrigations à l'automne",
    sowing: "Plantation des cormes : juillet – septembre",
    harvest: "Octobre – novembre",
    knownRegions: ["Souss-Massa", "Drâa-Tafilalet"],
  },
  // ---- Fourrages ----
  {
    id: "luzerne",
    fr: "Luzerne",
    en: "Alfalfa",
    category: "fodder",
    icon: "clover",
    description: "Plante fourragère riche en protéines pour l'élevage.",
    growing: "Culture pérenne (3 à 5 ans) avec de nombreuses coupes par an ; enrichit le sol en azote.",
    water: "Irrigué, besoins élevés",
    sowing: "Semis : septembre – novembre ou février – mars",
    harvest: "6 à 10 coupes par an",
    knownRegions: ["Drâa-Tafilalet", "Souss-Massa", "Béni Mellal-Khénifra", "Marrakech-Safi", "L'Oriental"],
  },
];

export const CROP_INFO_SOURCE =
  "Informations agricoles générales sur les cultures courantes au Maroc. Les zones de production citées sont indicatives et ne remplacent pas une recommandation agronomique vérifiée (sol, eau, climat local).";

export function isKnownInRegion(crop: Crop, region: string | undefined) {
  return Boolean(region) && (crop.knownRegions as string[]).includes(region!);
}

export interface CropFilter {
  category: CropCategory | "all";
  query: string;
}

/** Filters by category and search text, then lists crops known in the selected region first. */
export function filterCrops(
  crops: Crop[],
  { category, query }: CropFilter,
  region?: string,
  localized?: (c: Crop) => string[],
) {
  return crops
    .filter((c) => category === "all" || c.category === category)
    .filter((c) => matchesQuery(query, c.fr, c.en, CROP_CATEGORY_LABEL[c.category], ...(localized?.(c) ?? [])))
    .map((c, i) => ({ c, i, known: isKnownInRegion(c, region) }))
    .sort((a, b) => Number(b.known) - Number(a.known) || a.i - b.i)
    .map(({ c }) => c);
}
