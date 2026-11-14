import { createFileRoute } from "@tanstack/react-router";

import { ExploreView } from "@/components/explore/ExploreView";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — TerraScope" },
      {
        name: "description",
        content: "Explorez les territoires sur une carte interactive avec TerraScope.",
      },
      { property: "og:title", content: "Explore — TerraScope" },
      { property: "og:description", content: "Explorez les territoires sur une carte interactive avec TerraScope." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExploreView,
});
