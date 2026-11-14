import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import heroPoster from "@/assets/terrascope-hero-poster.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { SiteNav } from "./SiteNav";

export function ComingSoon({ eyebrow, title }: { eyebrow: string; title: string }) {
  const reduce = useReducedMotion();
  return (
    <>
      <SiteNav />
      <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-forest px-6">
        <img
          src={heroPoster.url}
          alt=""
          aria-hidden="true"
          className="hero-video -z-20 scale-110 opacity-40 blur-sm"
        />
        <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />
        <div aria-hidden="true" className="hero-vignette absolute inset-0 -z-10" />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">{eyebrow}</p>
          <h1 className="text-glow mt-5 text-4xl font-light tracking-tight text-ivory sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-ivory/75">Cette page arrive bientôt.</p>
          <Button asChild variant="hero" size="xl" className="mt-10">
            <Link to="/">
              <ArrowLeft className="relative" />
              <span className="relative">Retour à l'accueil</span>
            </Link>
          </Button>
        </motion.div>
      </main>
    </>
  );
}
