import { useState } from "react";
import { Info, MapPin, MapPinned, Tag, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { PROJECT_CATEGORIES, PROJECTS, type Project, type ProjectCategory, type ProjectFilter } from "@/lib/terrascope/projects";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyResults, FilterChips, Notice, SearchField } from "./controls";
import { Fact } from "./FarmerExperience";
import { PROJECT_ICONS } from "./icons";

type Props = {
  /** Already filtered + sorted list (shared with the map markers). */
  projects: Project[];
  filter: ProjectFilter;
  onFilterChange: (f: ProjectFilter) => void;
  region?: string | undefined;
  activeProjectId: string | null;
  onLocate: (id: string) => void;
};

export function EntrepreneurExperience({ projects, filter, onFilterChange, region, activeProjectId, onLocate }: Props) {
  const { t, place } = useI18n();
  const e = t.entrepreneur;
  const [openId, setOpenId] = useState<string | null>(null);
  const open = PROJECTS.find((p) => p.id === openId);
  const inRegion = region ? PROJECTS.filter((p) => p.region === region).length : 0;

  return (
    <section aria-labelledby="entrepreneur-heading" className="space-y-5">
      <div>
        <p className="ts-eyebrow">{e.eyebrow}</p>
        <h2 id="entrepreneur-heading" className="mt-2 text-2xl font-light tracking-tight text-forest sm:text-3xl">
          {e.titleBefore} <span className="font-medium text-primary">{e.titleAccent}</span>
        </h2>
      </div>

      <Notice icon={<Info className="size-4" />}>
        {e.noticeBefore} <strong className="font-semibold text-forest">{e.noticeStrong}</strong>
        {e.noticeAfter}
        {region && inRegion > 0 && e.inRegion(inRegion, place(region))}
      </Notice>

      <div className="space-y-3">
        <SearchField
          value={filter.query}
          onChange={(query) => onFilterChange({ ...filter, query })}
          placeholder={e.search}
          label={e.searchLabel}
        />
        <FilterChips<ProjectCategory | "all">
          label={t.common.filterByCategory}
          value={filter.category}
          onChange={(category) => onFilterChange({ ...filter, category })}
          options={[
            { value: "all", label: e.all, count: PROJECTS.length },
            ...PROJECT_CATEGORIES.map((c) => ({
              value: c,
              label: t.projectCategory[c],
              count: PROJECTS.filter((p) => p.categories.includes(c)).length,
            })),
          ]}
        />
      </div>

      <p className="text-xs text-forest/50" aria-live="polite">
        {e.shown(projects.length)}
      </p>

      {projects.length === 0 && <EmptyResults onReset={() => onFilterChange({ category: "all", query: "" })} />}

      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.id} id={`project-${p.id}`} className="scroll-mt-32">
            <ProjectCard
              project={p}
              active={p.id === activeProjectId}
              inRegion={p.region === region}
              onDetails={() => setOpenId(p.id)}
              onLocate={() => onLocate(p.id)}
            />
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        {open && (
          <ProjectDialog
            project={open}
            onLocate={() => {
              setOpenId(null);
              onLocate(open.id);
            }}
          />
        )}
      </Dialog>
    </section>
  );
}

function ProjectCard({
  project: p,
  active,
  inRegion,
  onDetails,
  onLocate,
}: {
  project: Project;
  active: boolean;
  inRegion: boolean;
  onDetails: () => void;
  onLocate: () => void;
}) {
  const { t, project, place } = useI18n();
  const text = project(p);
  const Icon: LucideIcon = PROJECT_ICONS[p.icon];
  return (
    <article className={cn("ts-card p-4 transition-shadow duration-300", active && "is-active")}>
      <div className="flex items-start gap-3.5">
        <span className="ts-icon-tile">
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-forest/40" dir="ltr">
              #{String(p.number).padStart(2, "0")}
            </span>
            <span className="ts-tag">{text.categoryLabel}</span>
            {inRegion && <span className="ts-tag is-primary">{t.entrepreneur.inYourRegion}</span>}
          </div>
          <h3 className="mt-1.5 font-semibold tracking-tight text-forest">{text.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-forest/65">{text.description}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-forest/55">
            <MapPin aria-hidden="true" className="size-3.5 text-primary" />
            {place(p.city)} · {place(p.region)}
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="paper" onClick={onDetails}>
              {t.entrepreneur.details}
            </Button>
            <Button type="button" size="sm" variant="soft" onClick={onLocate} aria-pressed={active}>
              <MapPinned />
              {t.entrepreneur.showOnMap}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectDialog({ project: p, onLocate }: { project: Project; onLocate: () => void }) {
  const { t, project, place, dir } = useI18n();
  const e = t.entrepreneur;
  const text = project(p);
  const Icon = PROJECT_ICONS[p.icon];
  return (
    <DialogContent className="ts-dialog" dir={dir}>
      <DialogHeader className="text-start">
        <span className="ts-icon-tile size-12">
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <p className="ts-eyebrow pt-3">
          {e.concept} <span dir="ltr">#{String(p.number).padStart(2, "0")}</span>
        </p>
        <DialogTitle className="text-2xl font-medium tracking-tight text-forest">{text.title}</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-forest/70">{text.description}</DialogDescription>
      </DialogHeader>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon={<Tag className="size-4" />} label={e.category} value={text.categoryLabel} />
        <Fact icon={<MapPin className="size-4" />} label={e.suggestedLocation} value={`${place(p.city)} · ${place(p.region)}`} />
        <Fact icon={<Info className="size-4" />} label={e.status} value={t.projectStatus} wide />
      </dl>
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-forest/50 uppercase">{e.plannedElements}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {text.highlights.map((h) => (
            <li key={h} className="ts-tag">
              {h}
            </li>
          ))}
        </ul>
      </div>
      <Button type="button" variant="hero" size="lg" className="justify-self-start" onClick={onLocate}>
        <MapPinned className="relative" />
        <span className="relative">{e.showOnMap}</span>
      </Button>
    </DialogContent>
  );
}
