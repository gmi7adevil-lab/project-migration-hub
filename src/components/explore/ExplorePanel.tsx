import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type ExplorePanelProps = {
  /** Panel heading. Until real content is provided, a placeholder bar is shown. */
  title?: ReactNode;
  /** Panel body. Until real content is provided, placeholder lines are shown. */
  children?: ReactNode;
  /** Seconds before the panel rises into view. */
  delay?: number;
  defaultOpen?: boolean;
  className?: string;
};

/** Collapsible glass panel that fades and slides up after the map appears. */
export function ExplorePanel({ title, children, delay = 1.6, defaultOpen = true, className }: ExplorePanelProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 36, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={cn("explore-panel rounded-3xl p-2", className)}
    >
      <div className="flex items-center gap-3 rounded-[1.25rem] px-4 py-3">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/15" />
        <div className="min-w-0 flex-1 text-sm font-semibold tracking-tight text-forest">
          {title ?? <span aria-hidden="true" className="block h-2.5 w-32 rounded-full bg-forest/10" />}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? t.explore.collapsePanel : t.explore.expandPanel}
          className="flex size-9 items-center justify-center rounded-full text-forest/60 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
        >
          <ChevronDown className={cn("size-4 transition-transform duration-500", open && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-1 pb-4">{children ?? <PanelPlaceholder />}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function PanelPlaceholder() {
  return (
    <div aria-hidden="true" className="space-y-3 rounded-2xl border border-dashed border-primary/25 p-5">
      {["w-11/12", "w-3/4", "w-1/2"].map((w, i) => (
        <span key={w} className={cn("panel-shimmer block h-2.5 rounded-full", w)} style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}
