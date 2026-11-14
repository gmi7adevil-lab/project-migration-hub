/** How a value was obtained — shown next to every figure for transparency. */
export type DataNature = "measured" | "modeled" | "estimated" | "forecast" | "derived" | "declarative";

export const NATURE_LABEL: Record<DataNature, string> = {
  measured: "Mesuré",
  modeled: "Modélisé",
  estimated: "Estimé",
  forecast: "Prévision",
  derived: "Calculé",
  declarative: "Cartographié (OSM)",
};

export interface Provenance {
  source: string;
  url?: string;
  updated?: string;
  resolution?: string;
  nature: DataNature;
}

export interface SelectedLocation {
  lat: number;
  lon: number;
  /** Place name from search / reverse geocoding, when known. */
  label?: string;
  origin: "map" | "search" | "gps";
}

export const UNAVAILABLE = "Données indisponibles";

/** Stable cache key for a location (≈ 11 m precision). */
export function locKey(loc: { lat: number; lon: number }) {
  return `${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`;
}
