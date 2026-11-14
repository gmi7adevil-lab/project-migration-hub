import { useState, type ComponentProps, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

type ExploreLinkProps = Omit<ComponentProps<typeof Link>, "to">;

/**
 * Link to /explore that first washes the screen in white from the click point,
 * then navigates. Falls back to a plain navigation for modified clicks,
 * reduced motion, or when already on /explore.
 */
export function ExploreLink({ onClick, ...props }: ExploreLinkProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (reduce || pathname === "/explore") return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (origin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: e.clientX || rect.left + rect.width / 2,
      y: e.clientY || rect.top + rect.height / 2,
    });
  }

  return (
    <>
      <Link to="/explore" onClick={handleClick} {...props} />
      {origin &&
        createPortal(
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[100] bg-paper"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${origin.x}px ${origin.y}px)` }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => navigate({ to: "/explore" })}
          />,
          document.body,
        )}
    </>
  );
}
