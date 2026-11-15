import type { RegionName } from "../regions";

/**
 * Broad bioclimatic zones used by the advisor. These are general, region-level tendencies
 * (a region usually spans several zones), not a measurement for a given plot.
 */
export type ClimateZone = "humid" | "subhumid" | "semiarid" | "arid" | "saharan" | "mountain";

export const CLIMATE_ZONES: ClimateZone[] = ["humid", "subhumid", "semiarid", "arid", "saharan", "mountain"];

/** Dominant zone first, then other zones present in the region. */
export const REGION_CLIMATE: Record<RegionName, ClimateZone[]> = {
  "Tanger-Tétouan-Al Hoceïma": ["subhumid", "humid", "mountain"],
  "L'Oriental": ["semiarid", "arid", "mountain"],
  "Fès-Meknès": ["subhumid", "semiarid", "mountain"],
  "Rabat-Salé-Kénitra": ["subhumid", "semiarid"],
  "Béni Mellal-Khénifra": ["semiarid", "mountain", "subhumid"],
  "Casablanca-Settat": ["semiarid", "subhumid"],
  "Marrakech-Safi": ["semiarid", "arid", "mountain"],
  "Drâa-Tafilalet": ["arid", "saharan", "mountain"],
  "Souss-Massa": ["arid", "semiarid", "mountain"],
  "Guelmim-Oued Noun": ["arid", "saharan"],
  "Laâyoune-Sakia El Hamra": ["saharan"],
  "Dakhla-Oued Ed-Dahab": ["saharan"],
};

export function regionClimate(region: string | undefined): ClimateZone[] {
  return region ? (REGION_CLIMATE[region as RegionName] ?? []) : [];
}

/** How far rainfall alone can carry a crop: 0 = not at all, 1 = drought-hardy crops only, 2 = moderate needs. */
export function rainfedCapacity(zones: ClimateZone[]): 0 | 1 | 2 {
  const main = zones[0];
  if (main === "humid" || main === "subhumid") return 2;
  if (main === "semiarid" || main === "mountain") return 2;
  if (main === "arid") return 1;
  return 0;
}
