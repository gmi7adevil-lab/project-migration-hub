import { useMemo, useState } from "react";
import { CalendarDays, Droplets, Info, MapPinCheck, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CROP_CATEGORY_LABEL,
  CROP_INFO_SOURCE,
  CROPS,
  filterCrops,
  isKnownInRegion,
  type Crop,
  type CropCategory,
} from "@/lib/terrascope/crops";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyResults, FilterChips, Notice, SearchField } from "./controls";
import { CROP_ICONS } from "./icons";

type CategoryFilter = CropCategory | "all";

export function FarmerExperience({ region }: { region?: string | undefined }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => filterCrops(CROPS, { category, query }, region), [category, query, region]);
  const groups = (["cereal", "vegetable"] as const)
    .map((c) => ({ category: c, crops: list.filter((x) => x.category === c) }))
    .filter((g) => g.crops.length > 0);
  const knownCount = region ? CROPS.filter((c) => isKnownInRegion(c, region)).length : 0;
  const open = CROPS.find((c) => c.id === openId);

  return (
    <section aria-labelledby="farmer-heading" className="space-y-5">
      <div>
        <p className="ts-eyebrow">Profil agriculteur</p>
        <h2 id="farmer-heading" className="mt-2 text-2xl font-light tracking-tight text-forest sm:text-3xl">
          Les cultures adaptées à <span className="font-medium text-primary">votre région</span>
        </h2>
      </div>

      <Notice icon={<Info className="size-4" />}>
        {CROP_INFO_SOURCE}
        {region && knownCount > 0 && (
          <>
            {" "}
            <strong className="font-semibold text-forest">{knownCount} cultures</strong> sont connues comme
            produites dans la région {region} ; elles sont listées en premier.
          </>
        )}
      </Notice>

      <div className="space-y-3">
        <SearchField value={query} onChange={setQuery} placeholder="Rechercher une culture…" label="Rechercher une culture" />
        <FilterChips<CategoryFilter>
          label="Filtrer par catégorie"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Toutes", count: CROPS.length },
            { value: "cereal", label: "Céréales", count: CROPS.filter((c) => c.category === "cereal").length },
            { value: "vegetable", label: "Légumes", count: CROPS.filter((c) => c.category === "vegetable").length },
          ]}
        />
      </div>

      {groups.length === 0 && (
        <EmptyResults
          onReset={() => {
            setQuery("");
            setCategory("all");
          }}
        />
      )}

      {groups.map((g) => (
        <div key={g.category}>
          <h3 className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-forest/50 uppercase">
            {g.category === "cereal" ? "A · Les céréales" : "B · Les légumes"}
            <span className="h-px flex-1 bg-forest/10" />
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {g.crops.map((c) => (
              <li key={c.id}>
                <CropCard crop={c} known={isKnownInRegion(c, region)} onOpen={() => setOpenId(c.id)} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        {open && <CropDialog crop={open} region={region} />}
      </Dialog>
    </section>
  );
}

function CropCard({ crop, known, onOpen }: { crop: Crop; known: boolean; onOpen: () => void }) {
  const Icon = CROP_ICONS[crop.icon];
  return (
    <button type="button" onClick={onOpen} className="ts-card ts-card-interactive group flex h-full w-full flex-col p-4 text-left">
      <div className="flex items-start gap-3">
        <span className={cn("ts-icon-tile", crop.category === "cereal" && "is-gold")}>
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight text-forest">{crop.fr}</p>
          <p className="text-xs text-forest/50 italic">{crop.en}</p>
        </div>
        <span className="ts-tag">{CROP_CATEGORY_LABEL[crop.category]}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-forest/65">{crop.description}</p>
      <div className="mt-auto space-y-1.5 pt-3 text-xs text-forest/60">
        <p className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
          <span className="truncate">Semis : {crop.sowing}</span>
        </p>
        {known && (
          <p className="flex items-center gap-2 font-semibold text-primary">
            <MapPinCheck aria-hidden="true" className="size-3.5" />
            Zone de production connue
          </p>
        )}
      </div>
    </button>
  );
}

function CropDialog({ crop, region }: { crop: Crop; region?: string | undefined }) {
  const Icon = CROP_ICONS[crop.icon];
  const known = isKnownInRegion(crop, region);
  return (
    <DialogContent className="ts-dialog">
      <DialogHeader className="text-left">
        <span className={cn("ts-icon-tile size-12", crop.category === "cereal" && "is-gold")}>
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <p className="ts-eyebrow pt-3">{CROP_CATEGORY_LABEL[crop.category]}</p>
        <DialogTitle className="text-2xl font-medium tracking-tight text-forest">{crop.fr}</DialogTitle>
        <DialogDescription className="text-forest/55 italic">{crop.en}</DialogDescription>
      </DialogHeader>
      <p className="text-sm leading-relaxed text-forest/75">{crop.description}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon={<Sprout className="size-4" />} label="Conduite de la culture" value={crop.growing} wide />
        <Fact icon={<CalendarDays className="size-4" />} label="Semis / plantation" value={crop.sowing} />
        <Fact icon={<CalendarDays className="size-4" />} label="Récolte" value={crop.harvest} />
        <Fact icon={<Droplets className="size-4" />} label="Eau" value={crop.water} wide />
      </dl>
      <div className="rounded-2xl bg-primary/[0.06] p-4 text-sm">
        <p className="font-semibold text-forest">Principales zones de production connues</p>
        <p className="mt-1 text-forest/70">{crop.knownRegions.join(" · ")}</p>
        {region && (
          <p className={cn("mt-2 text-xs", known ? "font-semibold text-primary" : "text-forest/55")}>
            {known
              ? `La région ${region} figure parmi ces zones (information indicative).`
              : `La région ${region} ne figure pas parmi les zones citées — cela ne signifie pas que la culture y est impossible.`}
          </p>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-forest/45">
        Information générale, non vérifiée à l'échelle de la parcelle. Consultez un conseiller agricole pour une
        recommandation adaptée à votre sol et à votre accès à l'eau.
      </p>
    </DialogContent>
  );
}

export function Fact({
  icon,
  label,
  value,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border border-forest/[0.08] p-3.5", wide && "sm:col-span-2")}>
      <dt className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-forest/50 uppercase">
        <span className="text-primary">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-forest">{value}</dd>
    </div>
  );
}
