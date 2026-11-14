import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin, Youtube, type LucideIcon } from "lucide-react";

import logo from "@/assets/terrascope-logo.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { SITE_CONTACT, SOCIAL_LINKS, type SocialNetwork } from "@/lib/terrascope/site";
import { ExploreLink } from "./ExploreLink";

const SOCIAL_ICONS: Record<SocialNetwork, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
};

const linkClass = "group inline-flex items-center gap-1.5 text-sm text-ivory/70 transition-colors hover:text-ivory";

export function SiteFooter() {
  const { t } = useI18n();
  const f = t.footer;
  return (
    <footer className="site-footer relative isolate overflow-hidden text-ivory">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Link to="/" aria-label={t.nav.homeAria} className="inline-block">
              <img src={logo.url} alt="TerraScope" width={1300} height={445} className="h-14 w-auto" loading="lazy" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/65">
              {f.tagline}
            </p>
            <ul className="mt-7 flex gap-2.5" aria-label={f.social}>
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.network];
                return (
                  <li key={s.network}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={f.socialOn(s.label)}
                      title={s.label}
                      className="social-icon"
                    >
                      <Icon className="size-[18px]" strokeWidth={1.7} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label={f.linksLabel}>
            <p className="footer-heading">{f.navHeading}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/" className={linkClass}>
                  {f.home}
                </Link>
              </li>
              <li>
                <ExploreLink className={linkClass}>
                  {f.explore}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100" />
                </ExploreLink>
              </li>
              <li>
                <Link to="/a-propos" className={linkClass}>
                  {f.about}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="footer-heading">{f.contactHeading}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${SITE_CONTACT.email}`} className={linkClass} dir="ltr">
                  <Mail aria-hidden="true" className="size-4 text-accent" />
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5 text-sm text-ivory/70">
                <MapPin aria-hidden="true" className="size-4 text-accent" />
                {f.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{f.rights}</p>
          <p className="font-light text-accent/90 italic">{f.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
