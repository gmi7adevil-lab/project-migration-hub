import { motion, useReducedMotion } from "motion/react";
import { Building2, Check, Sprout, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/terrascope/regions";

const PROFILES: { id: Profile; title: string; description: string; icon: LucideIcon }[] = [
  {
    id: "farmer",
    title: "Agriculteur",
    description: "Découvrez les cultures adaptées à votre région et explorez les opportunités agricoles.",
    icon: Sprout,
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    description: "Découvrez les opportunités d'investissement et les projets de développement territorial.",
    icon: Building2,
  },
];

export function ProfileSelector({ value, onChange }: { value: Profile | null; onChange: (p: Profile) => void }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <h2 id="profile-heading" className="text-xl font-medium tracking-tight text-forest sm:text-2xl">
        Quel est votre profil ?
      </h2>
      <div role="radiogroup" aria-labelledby="profile-heading" className="mt-4 grid gap-3 sm:grid-cols-2">
        {PROFILES.map((p, i) => {
          const selected = value === p.id;
          const Icon = p.icon;
          return (
            <motion.button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(p.id)}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              className={cn("profile-card group", selected && "is-selected")}
            >
              <span className="profile-card-icon">
                <Icon className="size-6" strokeWidth={1.6} />
              </span>
              <span className="profile-card-check" aria-hidden="true">
                <Check className="size-3.5" strokeWidth={2.5} />
              </span>
              <span className="mt-5 block text-lg font-semibold tracking-tight text-forest">{p.title}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-forest/60">{p.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
