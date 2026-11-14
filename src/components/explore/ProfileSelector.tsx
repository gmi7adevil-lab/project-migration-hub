import { motion, useReducedMotion } from "motion/react";
import { Building2, Check, Sprout, type LucideIcon } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/terrascope/regions";

const PROFILES: { id: Profile; icon: LucideIcon }[] = [
  { id: "farmer", icon: Sprout },
  { id: "entrepreneur", icon: Building2 },
];

export function ProfileSelector({ value, onChange }: { value: Profile | null; onChange: (p: Profile) => void }) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  return (
    <div>
      <h2 id="profile-heading" className="text-xl font-medium tracking-tight text-forest sm:text-2xl">
        {t.profile.question}
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
              <span className="mt-5 block text-lg font-semibold tracking-tight text-forest">{t.profile[p.id]}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-forest/60">{p.id === "farmer" ? t.profile.farmerText : t.profile.entrepreneurText}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
