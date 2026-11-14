import { useEffect, useState, type ComponentProps } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import logo from "@/assets/terrascope-logo.png.asset.json";
import logoDark from "@/assets/terrascope-logo-dark.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ExploreLink } from "./ExploreLink";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_ITEMS = [
  { to: "/", key: "home" },
  { to: "/explore", key: "explore" },
  { to: "/a-propos", key: "about" },
] as const;

type NavTone = "dark" | "light";

function NavLink({
  to,
  ...props
}: { to: (typeof NAV_ITEMS)[number]["to"] } & Omit<ComponentProps<typeof Link>, "to">) {
  if (to === "/explore") return <ExploreLink {...props} />;
  return <Link to={to} {...props} />;
}

/** `tone="light"` is for white pages (Explore); default suits dark/video pages. */
export function SiteNav({ tone = "dark" }: { tone?: NavTone }) {
  const light = tone === "light";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { t } = useI18n();

  useEffect(() => setOpen(false), [pathname]);

  // Once the page scrolls, fade in a soft backdrop so the logo never sits on top of content.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 pb-3 sm:px-8 sm:pt-6"
    >
      <div
        aria-hidden="true"
        className={cn(
          "nav-scrim pointer-events-none absolute inset-0 -z-10",
          light ? "nav-scrim-light" : "nav-scrim-dark",
          scrolled && "is-visible",
        )}
      />
      <nav
        aria-label={t.nav.main}
        className="mx-auto flex max-w-7xl items-center justify-between gap-6"
      >
        <Link to="/" aria-label={t.nav.homeAria} className="shrink-0">
          <img
            src={light ? logoDark.url : logo.url}
            alt="TerraScope"
            width={1300}
            height={445}
            className={cn("h-12 w-auto sm:h-16", !light && "drop-shadow-lg")}
          />
        </Link>

        <ul
          className={cn(
            light ? "nav-glass-light" : "nav-glass",
            "hidden items-center gap-1 rounded-full p-1.5 md:flex",
          )}
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;
            const highlight = hovered ? hovered === item.to : active;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onMouseEnter={() => setHovered(item.to)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative isolate block rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                    active
                      ? "text-ivory"
                      : light
                        ? "text-forest/65 hover:text-forest"
                        : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  {highlight && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        active ? (light ? "bg-primary" : "bg-primary/80") : light ? "bg-forest/[0.06]" : "bg-ivory/10",
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {t.nav[item.key]}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Same width as the logo so links stay optically centered */}
        <div className="hidden w-[187px] justify-end md:flex">
          <LanguageSwitcher tone={tone} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher tone={tone} compact />
          <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className={cn(
            "flex size-11 items-center justify-center rounded-full md:hidden",
            light ? "nav-glass-light text-forest" : "nav-glass text-ivory",
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              light ? "nav-glass-light nav-glass-light-solid" : "nav-glass nav-glass-solid",
              "mx-auto mt-3 flex max-w-7xl flex-col gap-1 rounded-3xl p-2 md:hidden",
            )}
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-2xl px-5 py-3.5 text-base font-medium transition-colors",
                      active
                        ? "bg-primary/80 text-ivory"
                        : light
                          ? "text-forest/75 hover:bg-forest/5"
                          : "text-ivory/80 hover:bg-ivory/10",
                    )}
                  >
                    {t.nav[item.key]}
                  </NavLink>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
