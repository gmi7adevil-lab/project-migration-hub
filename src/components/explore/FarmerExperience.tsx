import { useMemo, useState } from "react";
import { CalendarDays, Droplets, Info, MapPinCheck, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { CROPS, filterCrops, isKnownInRegion, type Crop, type CropCategory } from "@/lib/terrascope/crops";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyResults, FilterChips, Notice, SearchField } from "./controls";
import { CROP_ICONS } from "./icons";

type CategoryFilter = CropCategory | "all";

export function FarmerExperience({ region }: { region?: string | undefined }) {
  const { t, crop, place, lang } = useI18n();
  const f = t.farmer;
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(
    () => filterCrops(CROPS, { category, query }, region, (c) => [crop(c).name, t.cropCategory[c.category]]),
    // `crop` and `t` change with the language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, query, region, lang],
  );
  const groups = (["cereal", "vegetable"] as const)
    .map((c) => ({ category: c, crops: list.filter((x) => x.category === c) }))
    .filter((g) => g.crops.length > 0);
  const knownCount = region ? CROPS.filter((c) => isKnownInRegion(c, region)).length : 0;
  const open = CROPS.find((c) => c.id === openId);

  return (
    <section aria-labelledby="farmer-heading" className="space-y-5">
      <div>
        <p className="ts-eyebrow">{f.eyebrow}</p>
        <h2 id="farmer-heading" className="mt-2 text-2xl font-light tracking-tight text-forest sm:text-3xl">
          {f.titleBefore} <span className="font-medium text-primary">{f.titleAccent}</span>
        </h2>
      </div>

      <Notice icon={<Info className="size-4" />}>
        {f.infoSource}
        {region && knownCount > 0 && (
          <>
            {" "}
            <strong className="font-semibold text-forest">{f.knownInRegion(knownCount, place(region))}</strong>
          </>
        )}
      </Notice>

      <div className="space-y-3">
        <SearchField value={query} onChange={setQuery} placeholder={f.search} label={f.searchLabel} />
        <FilterChips<CategoryFilter>
          label={t.common.filterByCategory}
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: f.all, count: CROPS.length },
            { value: "cereal", label: t.cropCategory.cereal, count: CROPS.filter((c) => c.category === "cereal").length },
            { value: "vegetable", label: t.cropCategory.vegetable, count: CROPS.filter((c) => c.category === "vegetable").length },
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
            {g.category === "cereal" ? f.groupCereals : f.groupVegetables}
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

function CropCard({ crop: c, known, onOpen }: { crop: Crop; known: boolean; onOpen: () => void }) {
  const { t, crop, lang } = useI18n();
  const text = crop(c);
  const Icon = CROP_ICONS[c.icon];
  return (
    <button type="button" onClick={onOpen} className="ts-card ts-card-interactive group flex h-full w-full flex-col p-4 text-start">
      <div className="flex items-start gap-3">
        <span className={cn("ts-icon-tile", c.category === "cereal" && "is-gold")}>
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight text-forest">{text.name}</p>
          {lang === "fr" && <p className="text-xs text-forest/50 italic">{c.en}</p>}
        </div>
        <span className="ts-tag">{t.cropCategory[c.category]}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-forest/65">{text.description}</p>
      <div className="mt-auto space-y-1.5 pt-3 text-xs text-forest/60">
        <p className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">
            {t.farmer.sowingShort} : {text.sowing}
          </span>
        </p>
        {known && (
          <p className="flex items-center gap-2 font-semibold text-primary">
            <MapPinCheck aria-hidden="true" className="size-3.5 shrink-0" />
            {t.farmer.knownZone}
          </p>
        )}
      </div>
    </button>
  );
}

function CropDialog({ crop: c, region }: { crop: Crop; region?: string | undefined }) {
  const { t, crop, place, lang, dir } = useI18n();
  const f = t.farmer;
  const text = crop(c);
  const Icon = CROP_ICONS[c.icon];
  const known = isKnownInRegion(c, region);
  return (
    <DialogContent className="ts-dialog" dir={dir}>
      <DialogHeader className="text-start">
        <span className={cn("ts-icon-tile size-12", c.category === "cereal" && "is-gold")}>
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <p className="ts-eyebrow pt-3">{t.cropCategory[c.category]}</p>
        <DialogTitle className="text-2xl font-medium tracking-tight text-forest">{text.name}</DialogTitle>
        {lang === "fr" ? (
          <DialogDescription className="text-forest/55 italic">{c.en}</DialogDescription>
        ) : (
          <DialogDescription className="sr-only">{text.description}</DialogDescription>
        )}
      </DialogHeader>
      <p className="text-sm leading-relaxed text-forest/75">{text.description}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon={<Sprout className="size-4" />} label={f.growing} value={text.growing} wide />
        <Fact icon={<CalendarDays className="size-4" />} label={f.sowing} value={text.sowing} />
        <Fact icon={<CalendarDays className="size-4" />} label={f.harvest} value={text.harvest} />
        <Fact icon={<Droplets className="size-4" />} label={f.water} value={text.water} wide />
      </dl>
      <div className="rounded-2xl bg-primary/[0.06] p-4 text-sm">
        <p className="font-semibold text-forest">{f.mainZones}</p>
        <p className="mt-1 text-forest/70">{c.knownRegions.map((r) => place(r)).join(" · ")}</p>
        {region && (
          <p className={cn("mt-2 text-xs", known ? "font-semibold text-primary" : "text-forest/55")}>
            {known ? f.regionListed(place(region)) : f.regionNotListed(place(region))}
          </p>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-forest/45">{f.disclaimer}</p>
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
