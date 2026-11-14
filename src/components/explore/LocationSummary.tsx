import { ChevronDown, Layers, MapPin, RotateCcw } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { CROPS, isKnownInRegion } from "@/lib/terrascope/crops";
import { BOUNDARY_SOURCE } from "@/lib/terrascope/morocco";
import { PROJECTS } from "@/lib/terrascope/projects";
import { REGIONS, type TerritorySelection } from "@/lib/terrascope/regions";

type Props = {
  selection: TerritorySelection | null;
  onPickRegion: (region: string) => void;
  onReset: () => void;
};

/** Body of the information panel: chosen territory, key counts, a list fallback for picking a region, and the export entry point. */
export function LocationSummary({ selection, onPickRegion, onReset }: Props) {
  const { t, place } = useI18n();
  const l = t.location;
  const region = selection?.region;
  const projectCount = region ? PROJECTS.filter((p) => p.region === region).length : 0;
  const cropCount = region ? CROPS.filter((c) => isKnownInRegion(c, region)).length : 0;
  const name = selection ? place(selection.level === "province" ? selection.province : selection.region) : "";

  return (
    <div className="space-y-4">
      {selection ? (
        <div className="rounded-2xl bg-primary/[0.06] p-4">
          <p className="ts-eyebrow">{selection.level === "province" ? l.province : l.region}</p>
          <p className="mt-1.5 text-xl font-medium tracking-tight text-forest">{name || l.selectedFallback}</p>
          {selection.level === "province" && region && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-forest/60">
              <Layers aria-hidden="true" className="size-3.5" />
              {l.regionOf(place(region))}
            </p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-[11px] text-forest/50">{l.knownCrops}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-forest">{region ? cropCount : "—"}</dd>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-[11px] text-forest/50">{l.projectConcepts}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-forest">{region ? projectCount : "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-forest/65">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          {l.hint}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="ts-select min-w-0 flex-1">
          <span className="sr-only">{l.chooseRegion}</span>
          <select
            value={selection?.level === "region" ? (region ?? "") : ""}
            onChange={(e) => e.target.value && onPickRegion(e.target.value)}
            className="w-full min-w-0 cursor-pointer appearance-none bg-transparent pe-6 text-sm text-forest outline-none"
          >
            <option value="">{l.chooseRegionPlaceholder}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {place(r)}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none -ms-5 size-4 text-forest/45" />
        </label>
        {selection && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-forest/60 transition-colors hover:bg-forest/[0.06] hover:text-forest"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            {l.reset}
          </button>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-forest/40">
        {l.boundaries} : {BOUNDARY_SOURCE.source} · {l.boundaryResolution}
      </p>
    </div>
  );
}
