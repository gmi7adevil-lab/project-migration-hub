import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { CROPS, filterCrops } from "@/lib/terrascope/crops";
import { pointInGeometry, type Geometry } from "@/lib/terrascope/geo";
import { PROJECTS, filterProjects } from "@/lib/terrascope/projects";
import { REGIONS } from "@/lib/terrascope/regions";

const regions = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/morocco-regions.geojson"), "utf8"),
) as { features: { properties: { name: string }; geometry: Geometry }[] };

describe("regions", () => {
  it("match the region names in the map data", () => {
    expect([...REGIONS].sort()).toEqual(regions.features.map((f) => f.properties.name).sort());
  });
});

describe("crops", () => {
  it("lists the 6 cereals and 12 vegetables", () => {
    expect(CROPS.filter((c) => c.category === "cereal").map((c) => c.fr)).toEqual([
      "Blé tendre", "Blé dur", "Orge", "Maïs", "Avoine", "Riz",
    ]);
    expect(CROPS.filter((c) => c.category === "vegetable")).toHaveLength(12);
  });

  it("filters by category and accent-insensitive search", () => {
    expect(filterCrops(CROPS, { category: "cereal", query: "" })).toHaveLength(6);
    expect(filterCrops(CROPS, { category: "all", query: "mais" }).map((c) => c.id)).toEqual(["mais"]);
    expect(filterCrops(CROPS, { category: "all", query: "potatoes" }).map((c) => c.id)).toEqual(["pommes-de-terre"]);
  });

  it("lists crops known in the selected region first", () => {
    const list = filterCrops(CROPS, { category: "cereal", query: "" }, "Rabat-Salé-Kénitra");
    expect(list.at(-1)?.id).toBe("orge"); // the only cereal not listed for that region
  });
});

describe("sample projects", () => {
  it("has exactly 15 projects", () => {
    expect(PROJECTS).toHaveLength(15);
  });

  it.each(PROJECTS.map((p) => [p.title, p] as const))("%s marker lies inside its region", (_, p) => {
    const region = regions.features.find((f) => f.properties.name === p.region);
    expect(region).toBeDefined();
    expect(pointInGeometry(p.lat, p.lon, region!.geometry)).toBe(true);
  });

  it("filters by category, including combined categories", () => {
    expect(filterProjects(PROJECTS, { category: "health", query: "" }).map((p) => p.number)).toEqual([1, 2]);
    expect(filterProjects(PROJECTS, { category: "water", query: "" }).map((p) => p.number)).toEqual([7, 8]);
  });

  it("searches by name, category or location", () => {
    expect(filterProjects(PROJECTS, { category: "all", query: "dakhla" }).map((p) => p.number)).toEqual([7]);
    expect(filterProjects(PROJECTS, { category: "all", query: "tourisme" }).map((p) => p.number)).toEqual([11]);
    expect(filterProjects(PROJECTS, { category: "all", query: "fes-meknes" }).map((p) => p.number)).toEqual([3, 9]);
  });
});
