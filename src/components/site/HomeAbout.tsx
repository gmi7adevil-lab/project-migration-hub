import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Eye, Layers, Puzzle, Target, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ExploreLink } from "./ExploreLink";
import { TopoLines } from "./TopoLines";

const EASE = [0.22, 1, 0.36, 1] as const;
const ICONS: LucideIcon[] = [Eye, Target, Puzzle, Layers];

export const HOME_ABOUT_ID = "decouvrir";

/** Home-page introduction to TerraScope, revealed progressively as the visitor scrolls down to it. */
export function HomeAbout() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const a = t.homeAbout;

  const reveal = (i = 0, y = 28) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -12% 0px" },
          transition: { duration: 0.85, delay: i * 0.09, ease: EASE },
        };

  return (
    <section
      id={HOME_ABOUT_ID}
      aria-labelledby="home-about-heading"
      className="home-about relative isolate scroll-mt-0 overflow-hidden text-forest"
    >
      <TopoLines className="absolute inset-0 -z-10 h-full w-full text-primary/[0.09]" />
      <div aria-hidden="true" className="home-about-glow absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <motion.div {...reveal()} className="lg:sticky lg:top-32 lg:self-start">
            <p className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-primary uppercase sm:text-xs">
              <span className="h-px w-8 bg-primary/50" />
              {a.eyebrow}
            </p>
            <h2
              id="home-about-heading"
              className="mt-6 text-4xl leading-[1.08] font-light tracking-[-0.03em] sm:text-5xl"
            >
              {a.titleBefore}{" "}
              <span className="block font-medium text-primary">{a.titleAccent}</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-forest/65 sm:text-lg">{a.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <ExploreLink>
                  <span className="relative">{a.ctaExplore}</span>
                  <span className="relative flex size-7 items-center justify-center rounded-full bg-ivory/15 transition-transform duration-500 ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <ArrowRight className="rtl:-scale-x-100" />
                  </span>
                </ExploreLink>
              </Button>
              <Button asChild variant="paper" size="xl">
                <Link to="/a-propos">{a.ctaMore}</Link>
              </Button>
            </div>
          </motion.div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {a.blocks.map((b, i) => {
              const Icon = ICONS[i] ?? Layers;
              return (
                <motion.li key={i} {...reveal(i, 36)} className="ts-card ts-card-lift home-about-card p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className={i === 3 ? "ts-icon-tile is-gold size-12" : "ts-icon-tile size-12"}>
                      <Icon className="size-6" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-xs text-forest/30">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-medium tracking-tight">{b.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-forest/65">{b.text}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.ul
          {...reveal(1, 20)}
          className="mt-16 grid gap-3 border-t border-forest/[0.08] pt-8 sm:grid-cols-3 lg:mt-20"
        >
          {a.values.map((v) => (
            <li key={v} className="flex items-center gap-3 text-sm font-medium text-forest/75">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" strokeWidth={2.5} />
              </span>
              {v}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
