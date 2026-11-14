import { createFileRoute } from "@tanstack/react-router";

import { AboutView } from "@/components/about/AboutView";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — TerraScope" },
      {
        name: "description",
        content:
          "TerraScope, plateforme intelligente dédiée à l'exploration, à l'analyse et à la valorisation des territoires.",
      },
      { property: "og:title", content: "À propos de TerraScope" },
      {
        property: "og:description",
        content: "Notre vision, notre mission et nos objectifs pour une exploration intelligente des territoires.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutView,
});
