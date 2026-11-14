/** The 12 administrative regions, spelled exactly as in public/data/morocco-regions.geojson. */
export const REGIONS = [
  "Tanger-Tétouan-Al Hoceïma",
  "L'Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
] as const;

export type RegionName = (typeof REGIONS)[number];

export type BoundaryLevel = "regions" | "provinces";

/** What the user picked on the map (or in the region list). */
export interface TerritorySelection {
  level: "region" | "province";
  region?: string | undefined;
  province?: string | undefined;
}

export function selectionLabel(s: TerritorySelection) {
  return (s.level === "province" ? s.province : s.region) ?? "Territoire sélectionné";
}

export type Profile = "farmer" | "entrepreneur";
