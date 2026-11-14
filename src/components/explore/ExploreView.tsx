import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import { filterProjects, PROJECTS, type ProjectFilter } from "@/lib/terrascope/projects";
import type { BoundaryLevel, Profile, TerritorySelection } from "@/lib/terrascope/regions";
import { EntrepreneurExperience } from "./EntrepreneurExperience";
import { ExploreMap } from "./ExploreMap";
import { ExplorePanel } from "./ExplorePanel";
import { FarmerExperience } from "./FarmerExperience";
import { LocationSummary } from "./LocationSummary";
import { ProfileSelector } from "./ProfileSelector";

const EASE = [0.22, 1, 0.36, 1] as const;
const NO_PROJECTS: never[] = [];

const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

export function ExploreView() {
  const reduce = useReducedMotion();
  const { t, project, place, lang } = useI18n();
  useDocumentTitle(t.meta.explore);
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  const [level, setLevel] = useState<BoundaryLevel>("regions");
  const [selection, setSelection] = useState<TerritorySelection | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>({ category: "all", query: "" });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);

  const region = selection?.region;
  const projects = useMemo(
    () =>
      filterProjects(PROJECTS, filter, region, (p) => {
        const text = project(p);
        return [text.title, text.categoryLabel, place(p.city), place(p.region), ...p.categories.map((c) => t.projectCategory[c])];
      }),
    // `project`, `place` and `t` change with the language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, region, lang],
  );
  const mapProjects = profile === "entrepreneur" ? projects : NO_PROJECTS;

  const chooseProfile = (p: Profile) => {
    setProfile(p);
    if (p !== "entrepreneur") setActiveProjectId(null);
  };

  /** From a project card: highlight it on the map (and bring the map into view on small screens). */
  const locateProject = (id: string) => {
    setActiveProjectId(id);
    if (!isDesktop()) mapWrapRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /** From a map marker: sync the list. */
  const onMarkerSelect = useCallback((id: string) => {
    setActiveProjectId(id);
    if (isDesktop()) document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="min-h-svh bg-paper text-forest">
      <SiteNav tone="light" />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 pt-28 pb-16 sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8 lg:pb-24">
        <div className="lg:col-start-1 lg:row-start-1">
          <motion.p
            {...rise(0.15)}
            className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-primary uppercase sm:text-xs"
          >
            <span className="h-px w-8 bg-primary/50" />
            {t.explore.eyebrow}
          </motion.p>
          <motion.h1
            {...rise(0.25)}
            className="text-4xl leading-[1.05] font-light tracking-[-0.035em] text-forest sm:text-5xl lg:text-6xl"
          >
            {t.explore.titleBefore} <span className="font-medium text-primary">{t.explore.titleAccent}</span>
          </motion.h1>
          <motion.p {...rise(0.4)} className="mt-6 max-w-md text-base leading-relaxed text-forest/65 sm:text-lg">
            {t.explore.intro}
          </motion.p>
        </div>

        <div ref={mapWrapRef} className="scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-28">
            <ExploreMap
              className="h-[62svh] min-h-[360px] lg:h-[calc(100svh-8.5rem)] lg:min-h-[520px]"
              level={level}
              onLevelChange={setLevel}
              selection={selection}
              onSelect={setSelection}
              projects={mapProjects}
              activeProjectId={activeProjectId}
              onProjectSelect={onMarkerSelect}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2">
          <ExplorePanel title={t.explore.panelTitle}>
            <LocationSummary
              selection={selection}
              onPickRegion={(r) => {
                setLevel("regions");
                setSelection({ level: "region", region: r });
              }}
              onReset={() => {
                setSelection(null);
                setProfile(null);
                setActiveProjectId(null);
              }}
            />
          </ExplorePanel>

          <AnimatePresence mode="wait">
            {selection && (
              <motion.div
                key="profile"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <ProfileSelector value={profile} onChange={chooseProfile} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {selection && profile && (
              <motion.div
                key={profile}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {profile === "farmer" ? (
                  <FarmerExperience region={region} />
                ) : (
                  <EntrepreneurExperience
                    projects={projects}
                    filter={filter}
                    onFilterChange={setFilter}
                    region={region}
                    activeProjectId={activeProjectId}
                    onLocate={locateProject}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
