import type { Crop } from "@/lib/terrascope/crops";
import type { Project } from "@/lib/terrascope/projects";
import { arContent } from "./content/ar";
import { aryContent } from "./content/ary";
import type { ContentPack, CropText, ProjectText } from "./content/types";
import { zghContent } from "./content/zgh";
import type { Lang } from "./languages";
import { PLACES_AR } from "./places-ar";
import { PLACES_ZGH } from "./places-zgh";

export const CONTENT_PACKS: Record<Exclude<Lang, "fr">, ContentPack> = {
  ar: arContent,
  ary: aryContent,
  zgh: zghContent,
};

function frCrop(c: Crop): CropText {
  return { name: c.fr, description: c.description, growing: c.growing, water: c.water, sowing: c.sowing, harvest: c.harvest };
}

function frProject(p: Project): ProjectText {
  return { title: p.title, categoryLabel: p.categoryLabel, description: p.description, highlights: p.highlights };
}

/** Crop texts in the given language (French lives in the data module itself). */
export function cropText(lang: Lang, c: Crop): CropText {
  return lang === "fr" ? frCrop(c) : (CONTENT_PACKS[lang].crops[c.id] ?? frCrop(c));
}

export function projectText(lang: Lang, p: Project): ProjectText {
  return lang === "fr" ? frProject(p) : (CONTENT_PACKS[lang].projects[p.id] ?? frProject(p));
}

/** Region / province / city name in the given language. Arabic and Darija share the official Arabic names; Amazigh uses Tifinagh. */
export function placeName(lang: Lang, name: string | undefined): string {
  if (!name) return "";
  if (lang === "fr") return name;
  if (lang === "zgh") return PLACES_ZGH[name] ?? name;
  return PLACES_AR[name] ?? name;
}
