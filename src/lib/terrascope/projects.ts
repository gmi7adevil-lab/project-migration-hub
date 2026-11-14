import { matchesQuery } from "./text";
import type { RegionName } from "./regions";

export type ProjectCategory =
  | "health"
  | "agriculture"
  | "energy"
  | "education"
  | "water"
  | "tourism"
  | "logistics"
  | "environment";

export const PROJECT_CATEGORY_LABEL: Record<ProjectCategory, string> = {
  health: "Santé",
  agriculture: "Agriculture",
  energy: "Énergies renouvelables",
  education: "Éducation",
  water: "Infrastructures hydrauliques",
  tourism: "Tourisme",
  logistics: "Transport et logistique",
  environment: "Environnement",
};

export const PROJECT_CATEGORIES = Object.keys(PROJECT_CATEGORY_LABEL) as ProjectCategory[];

export type ProjectIcon =
  | "hospital"
  | "stethoscope"
  | "factory"
  | "snowflake"
  | "sun"
  | "wind"
  | "droplets"
  | "sprout"
  | "graduation"
  | "school"
  | "trees"
  | "truck"
  | "recycle"
  | "store"
  | "route";

/** Shown on every project: these are illustrative concepts, never existing or approved projects. */
export const PROJECT_STATUS = "Concept illustratif — non existant, non approuvé";

export interface Project {
  id: string;
  number: number;
  title: string;
  /** Filter keys this project belongs to. */
  categories: ProjectCategory[];
  /** Display label (may combine categories). */
  categoryLabel: string;
  icon: ProjectIcon;
  description: string;
  highlights: string[];
  /** Suggested city or area — never a street address. */
  city: string;
  region: RegionName;
  /** Approximate city/area centre. */
  lat: number;
  lon: number;
}

export const PROJECTS: Project[] = [
  {
    id: "hopital-marrakech",
    number: 1,
    title: "Hôpital régional moderne",
    categories: ["health"],
    categoryLabel: "Santé",
    icon: "hospital",
    description:
      "Développement d'un hôpital moderne doté d'un service d'urgences et de départements médicaux spécialisés.",
    highlights: ["Service d'urgences", "Départements spécialisés", "Plateau technique moderne"],
    city: "Marrakech",
    region: "Marrakech-Safi",
    lat: 31.6295,
    lon: -7.9811,
  },
  {
    id: "centre-medical-agadir",
    number: 2,
    title: "Centre médical régional",
    categories: ["health"],
    categoryLabel: "Santé",
    icon: "stethoscope",
    description: "Un centre médical offrant des services de santé accessibles à la population.",
    highlights: ["Consultations de proximité", "Prévention et dépistage", "Accessibilité"],
    city: "Agadir",
    region: "Souss-Massa",
    lat: 30.4278,
    lon: -9.5981,
  },
  {
    id: "usine-transformation-meknes",
    number: 3,
    title: "Unité de transformation agricole",
    categories: ["agriculture"],
    categoryLabel: "Agriculture",
    icon: "factory",
    description: "Une installation de transformation et de conditionnement des produits agricoles.",
    highlights: ["Transformation", "Conditionnement", "Valorisation locale"],
    city: "Meknès",
    region: "Fès-Meknès",
    lat: 33.8935,
    lon: -5.5473,
  },
  {
    id: "stockage-frigorifique-souss",
    number: 4,
    title: "Plateforme de stockage frigorifique",
    categories: ["agriculture"],
    categoryLabel: "Agriculture",
    icon: "snowflake",
    description: "Une infrastructure de stockage frigorifique pour réduire les pertes post-récolte.",
    highlights: ["Chaîne du froid", "Réduction des pertes", "Appui aux producteurs"],
    city: "Plaine du Souss",
    region: "Souss-Massa",
    lat: 30.394,
    lon: -9.209,
  },
  {
    id: "ferme-solaire-ouarzazate",
    number: 5,
    title: "Ferme solaire",
    categories: ["energy"],
    categoryLabel: "Énergies renouvelables",
    icon: "sun",
    description: "Un projet de production d'énergie solaire.",
    highlights: ["Production solaire", "Énergie décarbonée", "Fort ensoleillement"],
    city: "Ouarzazate",
    region: "Drâa-Tafilalet",
    lat: 30.9335,
    lon: -6.937,
  },
  {
    id: "eolien-tarfaya",
    number: 6,
    title: "Projet d'énergie éolienne",
    categories: ["energy"],
    categoryLabel: "Énergies renouvelables",
    icon: "wind",
    description: "Un projet de développement de production d'électricité éolienne.",
    highlights: ["Production éolienne", "Façade atlantique", "Énergie décarbonée"],
    city: "Tarfaya",
    region: "Laâyoune-Sakia El Hamra",
    lat: 27.9395,
    lon: -12.9264,
  },
  {
    id: "dessalement-dakhla",
    number: 7,
    title: "Station de dessalement d'eau de mer",
    categories: ["water"],
    categoryLabel: "Infrastructures hydrauliques",
    icon: "droplets",
    description: "Une station de dessalement pour améliorer la disponibilité en eau.",
    highlights: ["Eau potable", "Eau d'irrigation", "Sécurité hydrique"],
    city: "Dakhla",
    region: "Dakhla-Oued Ed-Dahab",
    lat: 23.7136,
    lon: -15.9355,
  },
  {
    id: "irrigation-tadla",
    number: 8,
    title: "Réseau d'irrigation moderne",
    categories: ["agriculture", "water"],
    categoryLabel: "Agriculture / Eau",
    icon: "sprout",
    description: "Développement d'infrastructures d'irrigation efficaces.",
    highlights: ["Irrigation localisée", "Économie d'eau", "Productivité agricole"],
    city: "Plaine du Tadla",
    region: "Béni Mellal-Khénifra",
    lat: 32.5,
    lon: -6.69,
  },
  {
    id: "formation-agricole-fes",
    number: 9,
    title: "Centre de formation agricole",
    categories: ["education", "agriculture"],
    categoryLabel: "Éducation / Agriculture",
    icon: "graduation",
    description: "Un centre proposant des formations aux techniques agricoles modernes.",
    highlights: ["Formation pratique", "Techniques modernes", "Accompagnement"],
    city: "Fès",
    region: "Fès-Meknès",
    lat: 34.0331,
    lon: -5.0003,
  },
  {
    id: "institut-technique-tanger",
    number: 10,
    title: "Institut d'enseignement technique",
    categories: ["education"],
    categoryLabel: "Éducation",
    icon: "school",
    description: "Un établissement de formation professionnelle aux compétences techniques.",
    highlights: ["Filières techniques", "Lien avec l'industrie", "Insertion professionnelle"],
    city: "Tanger",
    region: "Tanger-Tétouan-Al Hoceïma",
    lat: 35.7595,
    lon: -5.834,
  },
  {
    id: "ecotourisme-chefchaouen",
    number: 11,
    title: "Écolodge et tourisme durable",
    categories: ["tourism"],
    categoryLabel: "Tourisme",
    icon: "trees",
    description: "Une infrastructure touristique durable intégrée à son environnement.",
    highlights: ["Tourisme durable", "Patrimoine naturel", "Retombées locales"],
    city: "Chefchaouen",
    region: "Tanger-Tétouan-Al Hoceïma",
    lat: 35.1688,
    lon: -5.2636,
  },
  {
    id: "logistique-casablanca",
    number: 12,
    title: "Centre logistique et de distribution",
    categories: ["logistics"],
    categoryLabel: "Transport et logistique",
    icon: "truck",
    description: "Une plateforme logistique reliant les producteurs régionaux aux marchés.",
    highlights: ["Entreposage", "Distribution", "Connexion aux marchés"],
    city: "Casablanca",
    region: "Casablanca-Settat",
    lat: 33.5731,
    lon: -7.5898,
  },
  {
    id: "recyclage-rabat",
    number: 13,
    title: "Centre de tri et de recyclage",
    categories: ["environment"],
    categoryLabel: "Environnement",
    icon: "recycle",
    description: "Une installation moderne de tri et de recyclage des déchets.",
    highlights: ["Tri sélectif", "Valorisation des déchets", "Économie circulaire"],
    city: "Rabat",
    region: "Rabat-Salé-Kénitra",
    lat: 34.0209,
    lon: -6.8416,
  },
  {
    id: "marche-berkane",
    number: 14,
    title: "Marché régional de gros",
    categories: ["agriculture"],
    categoryLabel: "Agriculture / Commerce",
    icon: "store",
    description: "Un marché moderne de gros et de distribution des produits agricoles.",
    highlights: ["Commerce de gros", "Circuits de distribution", "Traçabilité"],
    city: "Berkane",
    region: "L'Oriental",
    lat: 34.92,
    lon: -2.32,
  },
  {
    id: "routes-beni-mellal",
    number: 15,
    title: "Désenclavement routier rural",
    categories: ["logistics"],
    categoryLabel: "Infrastructures",
    icon: "route",
    description:
      "Amélioration de la connectivité routière entre les communautés rurales et les marchés urbains.",
    highlights: ["Routes rurales", "Accès aux marchés", "Désenclavement"],
    city: "Béni Mellal",
    region: "Béni Mellal-Khénifra",
    lat: 32.3373,
    lon: -6.3498,
  },
];

export interface ProjectFilter {
  category: ProjectCategory | "all";
  query: string;
}

/** Filters by category and search (name, category, city, region); projects in `region` come first. */
export function filterProjects(projects: Project[], { category, query }: ProjectFilter, region?: string) {
  return projects
    .filter((p) => category === "all" || p.categories.includes(category))
    .filter((p) =>
      matchesQuery(
        query,
        p.title,
        p.categoryLabel,
        ...p.categories.map((c) => PROJECT_CATEGORY_LABEL[c]),
        p.city,
        p.region,
      ),
    )
    .sort((a, b) => Number(b.region === region) - Number(a.region === region) || a.number - b.number);
}
