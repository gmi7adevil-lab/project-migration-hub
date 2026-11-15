import type { ClimateZone } from "./climate";

export type Soil = "sandy" | "clay" | "loamy";
export type CropGoal = "food" | "commercial" | "fodder";
export type Level = 1 | 2 | 3;
export type CropRisk =
  | "drought"
  | "frost"
  | "heat"
  | "pests"
  | "diseases"
  | "price"
  | "waterCost"
  | "labour"
  | "lateEntry"
  | "storage"
  | "humidity";
export type CropImpact =
  | "lowWater"
  | "highWater"
  | "nitrogen"
  | "soilCover"
  | "erosion"
  | "carbon"
  | "inputs"
  | "plastic"
  | "biodiversity";
export type CostDriver = "seeds" | "fertilizer" | "irrigation" | "labour" | "plants" | "greenhouse" | "mechanization" | "corms";

/**
 * Language-neutral agronomic profile of a crop, used by the farmer advisor.
 * Yields are broad orders of magnitude for Morocco (assumptions, not measured data):
 * they vary a lot with the year, the variety and the farming practices.
 */
export interface Agro {
  /** 1 = low, 2 = moderate, 3 = high water needs. */
  waterNeed: Level;
  /** Can be grown on rainfall alone (bour) in suitable climates. */
  rainfed: boolean;
  goodSoils: Soil[];
  poorSoils: Soil[];
  climates: ClimateZone[];
  /** Relative cost to establish and run per hectare: 1 = low, 3 = high. */
  cost: Level;
  costDrivers: CostDriver[];
  goals: CropGoal[];
  /** High value per hectare but labour intensive (suits small plots). */
  intensive: boolean;
  yieldRainfed?: [number, number];
  yieldIrrigated?: [number, number];
  unit: "t" | "kg";
  /** Perennial crops: years before the first real harvest. */
  yearsToHarvest?: number;
  risks: CropRisk[];
  impacts: CropImpact[];
}

const CEREAL = { goodSoils: ["loamy", "clay"] as Soil[], poorSoils: ["sandy"] as Soil[], unit: "t" as const, intensive: false };
const VEG = { intensive: true, unit: "t" as const, cost: 2 as Level, goals: ["food", "commercial"] as CropGoal[] };

export const AGRO: Record<string, Agro> = {
  "ble-tendre": { ...CEREAL, waterNeed: 2, rainfed: true, climates: ["subhumid", "semiarid", "humid"], cost: 1, costDrivers: ["seeds", "fertilizer", "mechanization"], goals: ["food", "commercial"], yieldRainfed: [1, 3], yieldIrrigated: [4, 7], risks: ["drought", "diseases", "price"], impacts: ["inputs", "erosion"] },
  "ble-dur": { ...CEREAL, goodSoils: ["clay", "loamy"], waterNeed: 2, rainfed: true, climates: ["semiarid", "subhumid"], cost: 1, costDrivers: ["seeds", "fertilizer", "mechanization"], goals: ["food", "commercial"], yieldRainfed: [1, 2.5], yieldIrrigated: [4, 6], risks: ["drought", "humidity", "price"], impacts: ["inputs", "erosion"] },
  orge: { ...CEREAL, goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 1, rainfed: true, climates: ["semiarid", "arid", "subhumid", "mountain"], cost: 1, costDrivers: ["seeds", "mechanization"], goals: ["food", "fodder", "commercial"], yieldRainfed: [0.5, 2], yieldIrrigated: [3, 5], risks: ["drought", "price"], impacts: ["lowWater", "soilCover"] },
  mais: { ...CEREAL, goodSoils: ["loamy"], poorSoils: ["sandy"], waterNeed: 3, rainfed: false, climates: ["subhumid", "semiarid", "humid"], cost: 2, costDrivers: ["seeds", "fertilizer", "irrigation"], goals: ["fodder", "commercial", "food"], yieldIrrigated: [5, 9], risks: ["heat", "pests", "waterCost"], impacts: ["highWater", "inputs"] },
  avoine: { ...CEREAL, waterNeed: 2, rainfed: true, climates: ["subhumid", "humid", "mountain"], cost: 1, costDrivers: ["seeds", "mechanization"], goals: ["fodder", "food"], yieldRainfed: [1, 2.5], yieldIrrigated: [3, 4.5], risks: ["drought", "diseases"], impacts: ["soilCover", "lowWater"] },
  riz: { ...CEREAL, goodSoils: ["clay"], poorSoils: ["sandy"], waterNeed: 3, rainfed: false, climates: ["subhumid"], cost: 2, costDrivers: ["seeds", "irrigation", "labour"], goals: ["food", "commercial"], yieldIrrigated: [5, 8], risks: ["waterCost", "diseases"], impacts: ["highWater"] },

  "pommes-de-terre": { ...VEG, goodSoils: ["sandy", "loamy"], poorSoils: ["clay"], waterNeed: 3, rainfed: false, climates: ["subhumid", "semiarid", "mountain", "humid"], cost: 3, costDrivers: ["seeds", "fertilizer", "irrigation"], yieldIrrigated: [25, 40], risks: ["diseases", "price", "storage"], impacts: ["highWater", "inputs"] },
  tomates: { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["semiarid", "arid", "subhumid", "saharan"], cost: 3, costDrivers: ["plants", "greenhouse", "irrigation", "labour"], yieldIrrigated: [40, 80], risks: ["pests", "diseases", "price"], impacts: ["highWater", "plastic", "inputs"] },
  oignons: { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: ["clay"], waterNeed: 2, rainfed: false, climates: ["semiarid", "subhumid", "arid"], costDrivers: ["plants", "irrigation", "labour"], yieldIrrigated: [25, 45], risks: ["price", "storage", "diseases"], impacts: ["inputs"] },
  carottes: { ...VEG, goodSoils: ["sandy", "loamy"], poorSoils: ["clay"], waterNeed: 2, rainfed: false, climates: ["subhumid", "semiarid"], costDrivers: ["seeds", "irrigation", "labour"], yieldIrrigated: [30, 50], risks: ["price", "pests"], impacts: ["inputs"] },
  poivrons: { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["semiarid", "arid", "subhumid"], cost: 3, costDrivers: ["plants", "greenhouse", "irrigation"], yieldIrrigated: [25, 50], risks: ["frost", "pests", "price"], impacts: ["highWater", "plastic"] },
  courgettes: { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 2, rainfed: false, climates: ["semiarid", "subhumid", "arid"], costDrivers: ["seeds", "irrigation", "labour"], yieldIrrigated: [20, 40], risks: ["diseases", "price"], impacts: ["inputs"] },
  aubergines: { ...VEG, goodSoils: ["loamy"], poorSoils: [], waterNeed: 2, rainfed: false, climates: ["semiarid", "subhumid", "arid"], costDrivers: ["plants", "irrigation", "labour"], yieldIrrigated: [30, 50], risks: ["frost", "pests"], impacts: ["inputs"] },
  laitue: { ...VEG, goodSoils: ["loamy"], poorSoils: [], waterNeed: 2, rainfed: false, climates: ["subhumid", "semiarid", "humid"], cost: 1, costDrivers: ["plants", "irrigation", "labour"], yieldIrrigated: [20, 35], risks: ["heat", "price"], impacts: ["inputs"] },
  choux: { ...VEG, goodSoils: ["loamy", "clay"], poorSoils: [], waterNeed: 2, rainfed: false, climates: ["subhumid", "semiarid", "humid", "mountain"], cost: 1, costDrivers: ["plants", "irrigation", "fertilizer"], yieldIrrigated: [30, 50], risks: ["pests", "price"], impacts: ["inputs"] },
  "haricots-verts": { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: ["clay"], waterNeed: 2, rainfed: false, climates: ["semiarid", "subhumid", "arid"], cost: 3, costDrivers: ["seeds", "greenhouse", "labour"], yieldIrrigated: [10, 20], risks: ["frost", "labour", "price"], impacts: ["nitrogen", "plastic"] },
  concombres: { ...VEG, goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["semiarid", "arid", "subhumid"], costDrivers: ["seeds", "greenhouse", "irrigation"], yieldIrrigated: [30, 60], risks: ["diseases", "price"], impacts: ["highWater", "plastic"] },
  "petits-pois": { ...VEG, goodSoils: ["loamy", "clay"], poorSoils: [], waterNeed: 2, rainfed: true, climates: ["subhumid", "semiarid", "humid"], cost: 1, costDrivers: ["seeds", "labour"], yieldRainfed: [2, 4], yieldIrrigated: [5, 8], risks: ["drought", "labour"], impacts: ["nitrogen", "lowWater"] },

  "pois-chiche": { goodSoils: ["loamy", "clay"], poorSoils: [], waterNeed: 1, rainfed: true, climates: ["semiarid", "subhumid"], cost: 1, costDrivers: ["seeds", "mechanization"], goals: ["food", "commercial"], intensive: false, unit: "t", yieldRainfed: [0.6, 1.5], yieldIrrigated: [1.5, 2.5], risks: ["drought", "diseases"], impacts: ["nitrogen", "lowWater"] },
  lentille: { goodSoils: ["loamy", "clay"], poorSoils: ["sandy"], waterNeed: 1, rainfed: true, climates: ["semiarid", "subhumid"], cost: 1, costDrivers: ["seeds", "labour"], goals: ["food", "commercial"], intensive: false, unit: "t", yieldRainfed: [0.5, 1.2], risks: ["drought", "labour"], impacts: ["nitrogen", "lowWater"] },
  feve: { goodSoils: ["clay", "loamy"], poorSoils: ["sandy"], waterNeed: 2, rainfed: true, climates: ["subhumid", "semiarid", "humid", "mountain"], cost: 1, costDrivers: ["seeds", "labour"], goals: ["food", "fodder", "commercial"], intensive: false, unit: "t", yieldRainfed: [1, 2], yieldIrrigated: [2, 3.5], risks: ["drought", "diseases"], impacts: ["nitrogen", "soilCover"] },

  olivier: { goodSoils: ["loamy", "sandy"], poorSoils: [], waterNeed: 1, rainfed: true, climates: ["semiarid", "subhumid", "arid", "mountain"], cost: 3, costDrivers: ["plants", "irrigation", "labour"], goals: ["commercial", "food"], intensive: false, unit: "t", yieldRainfed: [1, 3], yieldIrrigated: [5, 10], yearsToHarvest: 4, risks: ["lateEntry", "drought", "price"], impacts: ["carbon", "erosion", "lowWater"] },
  amandier: { goodSoils: ["loamy", "sandy"], poorSoils: ["clay"], waterNeed: 1, rainfed: true, climates: ["semiarid", "arid", "mountain"], cost: 3, costDrivers: ["plants", "labour"], goals: ["commercial", "food"], intensive: false, unit: "t", yieldRainfed: [0.3, 0.8], yieldIrrigated: [1, 2.5], yearsToHarvest: 3, risks: ["frost", "lateEntry", "drought"], impacts: ["carbon", "erosion", "lowWater"] },
  "palmier-dattier": { goodSoils: ["sandy", "loamy"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["saharan", "arid"], cost: 3, costDrivers: ["plants", "irrigation", "labour"], goals: ["commercial", "food"], intensive: false, unit: "t", yieldIrrigated: [4, 8], yearsToHarvest: 5, risks: ["lateEntry", "diseases", "waterCost"], impacts: ["highWater", "biodiversity", "carbon"] },
  "figuier-barbarie": { goodSoils: ["sandy", "loamy"], poorSoils: ["clay"], waterNeed: 1, rainfed: true, climates: ["arid", "semiarid", "saharan"], cost: 1, costDrivers: ["plants", "labour"], goals: ["food", "fodder", "commercial"], intensive: false, unit: "t", yieldRainfed: [5, 15], yearsToHarvest: 2, risks: ["pests", "price"], impacts: ["erosion", "lowWater", "soilCover"] },
  agrumes: { goodSoils: ["loamy", "sandy"], poorSoils: ["clay"], waterNeed: 3, rainfed: false, climates: ["semiarid", "subhumid", "arid"], cost: 3, costDrivers: ["plants", "irrigation", "fertilizer"], goals: ["commercial", "food"], intensive: false, unit: "t", yieldIrrigated: [20, 40], yearsToHarvest: 3, risks: ["frost", "waterCost", "lateEntry", "price"], impacts: ["highWater", "carbon"] },

  menthe: { goodSoils: ["loamy", "clay"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["semiarid", "subhumid", "arid"], cost: 2, costDrivers: ["plants", "irrigation", "labour"], goals: ["commercial"], intensive: true, unit: "t", yieldIrrigated: [15, 30], risks: ["labour", "price", "pests"], impacts: ["highWater", "inputs"] },
  safran: { goodSoils: ["loamy", "sandy"], poorSoils: ["clay"], waterNeed: 1, rainfed: false, climates: ["mountain", "arid", "semiarid"], cost: 3, costDrivers: ["corms", "labour"], goals: ["commercial"], intensive: true, unit: "kg", yieldIrrigated: [4, 8], risks: ["labour", "price", "diseases"], impacts: ["lowWater", "biodiversity"] },

  luzerne: { goodSoils: ["loamy", "clay"], poorSoils: [], waterNeed: 3, rainfed: false, climates: ["semiarid", "arid", "saharan", "subhumid"], cost: 2, costDrivers: ["seeds", "irrigation", "mechanization"], goals: ["fodder", "commercial"], intensive: false, unit: "t", yieldIrrigated: [50, 90], risks: ["waterCost", "pests"], impacts: ["nitrogen", "highWater", "soilCover"] },
};
