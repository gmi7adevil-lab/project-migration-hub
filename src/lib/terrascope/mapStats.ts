import { CROPS } from "./crops";
import type { Project, ProjectCategory } from "./projects";
import { REGIONS } from "./regions";

/**
 * Crop-presence classes used by every map (live and exported).
 * Class 0 = no crop recorded for the region; 1–5 = increasing number of known crops.
 */
export const CROP_CLASS_BREAKS = [
  { cls: 1, min: 1, max: 2 },
  { cls: 2, min: 3, max: 5 },
  { cls: 3, min: 6, max: 8 },
  { cls: 4, min: 9, max: 12 },
  { cls: 5, min: 13, max: CROPS.length },
] as const;

export type CropClass = 0 | 1 | 2 | 3 | 4 | 5;

export function knownCropCount(region: string) {
  return CROPS.filter((c) => (c.knownRegions as string[]).includes(region)).length;
}

export const CROP_COUNT_BY_REGION: Record<string, number> = Object.fromEntries(REGIONS.map((r) => [r, knownCropCount(r)]));

export function cropClass(count: number): CropClass {
  if (count <= 0) return 0;
  return (CROP_CLASS_BREAKS.find((b) => count >= b.min && count <= b.max)?.cls ?? 5) as CropClass;
}

/** Category that drives a project's marker colour (the first listed one). */
export function primaryCategory(p: Project): ProjectCategory {
  return p.categories[0]!;
}
