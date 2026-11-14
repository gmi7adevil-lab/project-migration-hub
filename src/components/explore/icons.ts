import {
  Bean,
  Carrot,
  Cherry,
  Droplets,
  Factory,
  GraduationCap,
  Hospital,
  Leaf,
  LeafyGreen,
  Recycle,
  Route,
  Salad,
  School,
  Snowflake,
  Sprout,
  Stethoscope,
  Store,
  Sun,
  Trees,
  Truck,
  Vegan,
  Wheat,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type { CropIcon } from "@/lib/terrascope/crops";
import type { ProjectIcon } from "@/lib/terrascope/projects";

export const CROP_ICONS: Record<CropIcon, LucideIcon> = {
  wheat: Wheat,
  sprout: Sprout,
  cherry: Cherry,
  carrot: Carrot,
  salad: Salad,
  leafy: LeafyGreen,
  bean: Bean,
  leaf: Leaf,
  vegan: Vegan,
};

export const PROJECT_ICONS: Record<ProjectIcon, LucideIcon> = {
  hospital: Hospital,
  stethoscope: Stethoscope,
  factory: Factory,
  snowflake: Snowflake,
  sun: Sun,
  wind: Wind,
  droplets: Droplets,
  sprout: Sprout,
  graduation: GraduationCap,
  school: School,
  trees: Trees,
  truck: Truck,
  recycle: Recycle,
  store: Store,
  route: Route,
};
