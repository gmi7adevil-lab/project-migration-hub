import { ChevronDown, Layers, MapPin, RotateCcw } from "lucide-react";

import { CROPS, isKnownInRegion } from "@/lib/terrascope/crops";
import { BOUNDARY_SOURCE } from "@/lib/terrascope/morocco";
import { PROJECTS } from "@/lib/terrascope/projects";
import { REGIONS, selectionLabel, type TerritorySelection } from "@/lib/terrascope/regions";

type Props = {
  selection: TerritorySelection | null;
  onPickRegion: (region: string) => void;
  onReset: () => void;
};

/** Body of the information panel: chosen territory, key counts, and a list fallback for picking a region. */
export function LocationSummary({ selection, onPickRegion, onReset }: Props) {
  const region = selection?.region;
  const projectCount = region ? PROJECTS.filter((p) => p.region === region).length : 0;
  const cropCount = region ? CROPS.filter((c) => isKnownInRegion(c, region)).length : 0;

  return (
    <div className="space-y-4">
      {selection ? (
        <div className="rounded-2xl bg-primary/[0.06] p-4">
          <p className="ts-eyebrow">{selection.level === "province" ? "Province / préfecture" : "Région"}</p>
          <p className="mt-1.5 text-xl font-medium tracking-tight text-forest">{selectionLabel(selection)}</p>
          {selection.level === "province" && region && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-forest/60">
              <Layers aria-hidden="true" className="size-3.5" />
              Région {region}
            </p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-[11px] text-forest/50">Cultures connues dans la région</dt>
              <dd className="mt-0.5 text-lg font-semibold text-forest">{region ? cropCount : "—"}</dd>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <dt className="text-[11px] text-forest/50">Concepts de projets</dt>
              <dd className="mt-0.5 text-lg font-semibold text-forest">{region ? projectCount : "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-forest/65">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          Sélectionnez une région ou une province directement sur la carte, ou choisissez une région dans la liste.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="ts-select min-w-0 flex-1">
          <span className="sr-only">Choisir une région</span>
          <select
            value={selection?.level === "region" ? (region ?? "") : ""}
            onChange={(e) => e.target.value && onPickRegion(e.target.value)}
            className="w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 text-sm text-forest outline-none"
          >
            <option value="">Choisir une région…</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none -ml-5 size-4 text-forest/45" />
        </label>
        {selection && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-forest/60 transition-colors hover:bg-forest/[0.06] hover:text-forest"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Réinitialiser
          </button>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-forest/40">
        Limites : {BOUNDARY_SOURCE.source} · {BOUNDARY_SOURCE.resolution}
      </p>
    </div>
  );
}
