<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Large media (videos, logos) live as lovable-assets pointers in src/assets/*.asset.json, never as binaries in public/ — repo has a 10 MB per-file limit.
- Shared site chrome (nav) lives in src/components/site and is rendered per route, so placeholder pages reuse it without a root layout change.
- Explore map uses plain Leaflet imported dynamically inside useEffect (no react-leaflet) because Leaflet touches window at import and would break SSR; Leaflet CSS overrides stay outside @layer since leaflet.css is unlayered.
- Links into /explore go through components/site/ExploreLink so every entry point shares the same white reveal transition.
- Explore state (territory selection, profile, project filters, active project) lives in ExploreView and flows into ExploreMap as props, so map markers and lists never drift apart.
- Explore reference data (regions, crops, sample projects, site/contact links) lives in src/lib/terrascope as plain typed modules; region names must match the GeoJSON exactly, which src/test/terrascope-data.test.ts enforces.
- Leaflet boundary/marker colors come from CSS classes (ts-boundary, ts-marker, ts-popup) rather than Leaflet style options, so the map follows the design tokens.
- Shared footer (components/site/SiteFooter) is rendered per route, like SiteNav.
