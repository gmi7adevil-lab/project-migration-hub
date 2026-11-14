import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/site/Hero";
import { HOME_ABOUT_ID, HomeAbout } from "@/components/site/HomeAbout";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { useDocumentTitle, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TerraScope — L'intelligence au service de la terre" },
      {
        name: "description",
        content:
          "Explorez, analysez et comprenez les territoires grâce à une nouvelle approche intelligente de la donnée.",
      },
      { property: "og:title", content: "TerraScope — L'intelligence au service de la terre" },
      {
        property: "og:description",
        content: "La terre de demain se choisit avec intelligence aujourd'hui.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  useDocumentTitle(t.meta.home);
  return (
    <>
      <SiteNav />
      <main>
        <Hero nextSectionId={HOME_ABOUT_ID} />
        <HomeAbout />
      </main>
      <SiteFooter />
    </>
  );
}
