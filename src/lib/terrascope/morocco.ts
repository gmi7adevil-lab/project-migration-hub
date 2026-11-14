import { pointInGeometry, type Geometry } from "./geo";

interface Feature {
  properties: { name: string };
  geometry: Geometry;
}
interface Collection {
  features: Feature[];
}

export const BOUNDARY_SOURCE = {
  source: "geoBoundaries (OpenStreetMap / Wambacher), ODbL",
  url: "https://www.geoboundaries.org/",
  resolution: "Limites simplifiées (précision ≈ 100 m)",
  updated: "2023",
} as const;

const cache = new Map<string, Promise<Collection>>();

export function loadBoundaries(kind: "country" | "regions" | "provinces"): Promise<Collection> {
  let p = cache.get(kind);
  if (!p) {
    p = fetch(`/data/morocco-${kind}.geojson`).then((r) => {
      if (!r.ok) throw new Error(`Limites ${kind} indisponibles`);
      return r.json() as Promise<Collection>;
    });
    p.catch(() => cache.delete(kind));
    cache.set(kind, p);
  }
  return p;
}

export interface AdminLocation {
  inMorocco: boolean;
  region?: string | undefined;
  province?: string | undefined;
}

/** Locates a point in the national, regional and provincial boundaries. */
export async function locateAdmin(lat: number, lon: number): Promise<AdminLocation> {
  const [country, regions, provinces] = await Promise.all([
    loadBoundaries("country"),
    loadBoundaries("regions"),
    loadBoundaries("provinces"),
  ]);
  const region = regions.features.find((f) => pointInGeometry(lat, lon, f.geometry))?.properties.name;
  const province = provinces.features.find((f) => pointInGeometry(lat, lon, f.geometry))?.properties.name;
  const inCountry = country.features.some((f) => pointInGeometry(lat, lon, f.geometry));
  return { inMorocco: inCountry || Boolean(region), region, province };
}

/** Country bounding box (south-west, north-east) used to frame the map. */
export const MOROCCO_BOUNDS: [[number, number], [number, number]] = [
  [20.77, -17.1],
  [35.93, -1.0],
];
