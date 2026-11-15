import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import heroVideo from "@/assets/terrascope-hero.mp4.asset.json";
import heroPoster from "@/assets/terrascope-hero-poster.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { ExploreLink } from "./ExploreLink";

const EASE = [0.22, 1, 0.36, 1] as const;

const WORD_DELAY = 0.85;
const WORD_STAGGER = 0.085;

// Word-by-word reveal: each word rises, sharpens and fades in, in reading order.
const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(12px)" },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 1.3, delay: WORD_DELAY + i * WORD_STAGGER, ease: EASE },
  }),
};

export function Hero({ nextSectionId }: { nextSectionId?: string }) {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  const headlineWords = t.hero.headline.map((line) => line.split(" "));
  const lineOffsets = headlineWords.map((_, i) => headlineWords.slice(0, i).reduce((n, w) => n + w.length, 0));
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Gentle pointer parallax on the video layer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const vx = useTransform(sx, (v) => v * -14);
  const vy = useTransform(sy, (v) => v * -10);
  const tx = useTransform(sx, (v) => v * 6);
  const ty = useTransform(sy, (v) => v * 4);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay may be blocked; the poster remains visible */
    });
  }, []);

  function handlePointer(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      onPointerMove={handlePointer}
      className="relative isolate flex h-svh min-h-[560px] w-full items-center justify-center overflow-hidden bg-forest"
      aria-label="TerraScope"
    >
      {/* Background video */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-6 -z-30"
        style={reduce ? {} : { x: vx, y: vy }}
        initial={reduce ? false : { scale: 1.12, opacity: 0 }}
        animate={{ scale: 1.04, opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        {videoFailed ? (
          <img src={heroPoster.url} alt="" className="hero-video" />
        ) : (
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster.url}
            onError={() => setVideoFailed(true)}
          >
            <source src={heroVideo.url} type="video/mp4" onError={() => setVideoFailed(true)} />
          </video>
        )}
      </motion.div>

      {/* Overlays for legibility */}
      <div aria-hidden="true" className="hero-veil absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-vignette absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-fade absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 -z-10" />

      {/* Content */}
      <motion.div
        style={reduce ? {} : { x: tx, y: ty }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 text-center"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          dir="ltr"
          className="mb-8 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-accent uppercase sm:text-xs"
        >
          <span className="h-px w-8 bg-accent/60" />
          Observe · Analyze · Act
          <span className="h-px w-8 bg-accent/60" />
        </motion.p>

        <h1 key={lang} className="text-glow text-[2.6rem] leading-[1.02] font-light tracking-[-0.035em] text-ivory sm:text-6xl md:text-7xl lg:text-[5.6rem]">
          {headlineWords.map((words, i) => (
            <span
              key={i}
              className={cn("block pb-[0.08em]", i === 1 && "font-medium", i === 2 && "text-accent")}
            >
              {words.map((word, j) => (
                <span key={j}>
                  <motion.span
                    className="inline-block will-change-transform"
                    custom={(lineOffsets[i] ?? 0) + j}
                    variants={wordVariants}
                    initial={reduce ? false : "hidden"}
                    animate="show"
                  >
                    {word}
                  </motion.span>
                  {j < words.length - 1 && " "}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.55, ease: EASE }}
          className="text-glow mt-8 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.8, ease: EASE }}
          className="mt-11"
        >
          <Button asChild variant="hero" size="xl">
            <ExploreLink>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-ivory/25 blur-md group-hover:animate-shimmer"
              />
              <span className="relative">{t.hero.cta}</span>
              <span className="relative flex size-7 items-center justify-center rounded-full bg-ivory/15 transition-transform duration-500 ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <ArrowRight className="transition-transform duration-500 group-hover:-rotate-45 rtl:-scale-x-100 rtl:group-hover:rotate-45" />
              </span>
            </ExploreLink>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue — takes the visitor down to the About section */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.4 }}
        className="absolute inset-x-0 bottom-6 flex justify-center sm:bottom-8"
      >
        {nextSectionId ? (
          <a
            href={`#${nextSectionId}`}
            onClick={(e) => {
              const el = document.getElementById(nextSectionId);
              if (!el) return;
              e.preventDefault();
              el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            }}
            aria-label={t.hero.scrollCue}
            title={t.hero.scrollCue}
            className="group flex h-11 w-9 items-start justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
          >
            <span className="flex h-9 w-5 justify-center rounded-full border border-ivory/40 pt-2 transition-colors group-hover:border-ivory/80">
              <span className="block size-1 rounded-full bg-ivory animate-scroll-dot" />
            </span>
          </a>
        ) : (
          <span aria-hidden="true" className="flex h-9 w-5 justify-center rounded-full border border-ivory/40 pt-2">
            <span className="block size-1 rounded-full bg-ivory animate-scroll-dot" />
          </span>
        )}
      </motion.div>
    </section>
  );
}
