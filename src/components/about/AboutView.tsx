import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Compass,
  Eye,
  Lightbulb,
  Map as MapIcon,
  Sprout,
  Target,
  TrendingUp,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import heroPoster from "@/assets/terrascope-hero-poster.jpg.asset.json";
import emblem from "@/assets/terrascope-emblem.png.asset.json";
import { Button } from "@/components/ui/button";
import { ExploreLink } from "@/components/site/ExploreLink";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { useDocumentTitle, useI18n } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

const PILLAR_ICONS: LucideIcon[] = [Eye, Target];
const GOAL_ICONS: LucideIcon[] = [MapIcon, Sprout, TrendingUp, Lightbulb, Waypoints];

export function AboutView() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const a = t.about;
  useDocumentTitle(t.meta.about);
  const pillars = [
    { eyebrow: "01", title: a.visionTitle, text: a.visionText },
    { eyebrow: "02", title: a.missionTitle, text: a.missionText },
  ];
  const reveal = (i = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
        };

  return (
    <>
      <SiteNav />
      <main>
        {/* Intro — same veil, vignette and poster as the home hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-forest px-6 pt-36 pb-20 sm:px-8">
          <img src={heroPoster.url} alt="" aria-hidden="true" className="hero-video -z-30 scale-105 opacity-55" />
          <div aria-hidden="true" className="hero-veil absolute inset-0 -z-20" />
          <div aria-hidden="true" className="hero-vignette absolute inset-0 -z-20" />
          <div aria-hidden="true" className="hero-fade absolute inset-0 -z-20" />
          <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 -z-10" />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="mx-auto w-full max-w-7xl"
          >
            <p className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-accent uppercase sm:text-xs">
              <span className="h-px w-8 bg-accent/60" />
              {a.eyebrow}
            </p>
            <h1 className="text-glow max-w-3xl text-4xl leading-[1.05] font-light tracking-[-0.035em] text-ivory sm:text-6xl">
              {a.titleBefore} <span className="font-medium text-accent">TerraScope</span>
            </h1>
            <p className="text-glow mt-6 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
              {a.intro}
            </p>
          </motion.div>
        </section>

        <div className="bg-paper text-forest">
          {/* Vision & Mission */}
          <section className="mx-auto grid max-w-7xl gap-5 px-6 py-20 sm:px-8 md:grid-cols-2 lg:py-28">
            {pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i]!;
              return (
              <motion.article key={p.eyebrow} {...reveal(i)} className="ts-card ts-card-lift p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="ts-icon-tile size-12">
                    <Icon className="size-6" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-xs text-forest/30">{p.eyebrow}</span>
                </div>
                <h2 className="mt-8 text-2xl font-medium tracking-tight">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-forest/65">{p.text}</p>
              </motion.article>
              );
            })}
          </section>

          {/* Objectifs */}
          <section className="border-y border-forest/[0.06] bg-ivory/60">
            <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-24">
              <motion.div {...reveal()} className="flex items-end justify-between gap-6">
                <div>
                  <p className="ts-eyebrow">03</p>
                  <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                    {a.goalsBefore} <span className="font-medium text-primary">{a.goalsAccent}</span>
                  </h2>
                </div>
              </motion.div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {a.goals.map((text, i) => {
                  const Icon = GOAL_ICONS[i] ?? MapIcon;
                  return (
                    <motion.li key={i} {...reveal(i)} className="ts-card ts-card-lift flex flex-col gap-5 p-5">
                      <span className="ts-icon-tile">
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <p className="text-sm leading-relaxed font-medium text-forest/80">{text}</p>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Approche */}
          <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-28">
            <motion.div
              {...reveal()}
              className="about-approach relative isolate grid items-center gap-10 overflow-hidden rounded-[2rem] p-8 text-ivory sm:p-12 md:grid-cols-[auto_1fr] lg:p-16"
            >
              <img src={emblem.url} alt="" aria-hidden="true" width={520} height={445} className="w-28 sm:w-36" loading="lazy" />
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-accent uppercase">
                  <Compass className="size-3.5" /> {a.approachLabel}
                </p>
                <p className="mt-5 max-w-2xl text-xl leading-relaxed font-light sm:text-2xl">
                  {a.approachText}
                </p>
                <Button asChild variant="hero" size="xl" className="mt-9">
                  <ExploreLink>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-ivory/25 blur-md group-hover:animate-shimmer"
                    />
                    <span className="relative">{a.cta}</span>
                    <span className="relative flex size-7 items-center justify-center rounded-full bg-ivory/15 transition-transform duration-500 ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      <ArrowRight className="transition-transform duration-500 group-hover:-rotate-45 rtl:-scale-x-100 rtl:group-hover:rotate-45" />
                    </span>
                  </ExploreLink>
                </Button>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
