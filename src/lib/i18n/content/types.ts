/** Translated text for one crop (ids come from src/lib/terrascope/crops.ts). */
export interface CropText {
  name: string;
  description: string;
  growing: string;
  water: string;
  sowing: string;
  harvest: string;
}

/** Translated text for one illustrative project (ids come from src/lib/terrascope/projects.ts). */
export interface ProjectText {
  title: string;
  categoryLabel: string;
  description: string;
  highlights: string[];
}

/** Content translations for one non-French language. French content lives in the data modules. */
export interface ContentPack {
  crops: Record<string, CropText>;
  projects: Record<string, ProjectText>;
}
