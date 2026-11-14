import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type * as Leaflet from "leaflet";
import { Layers, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { loadBoundaries, locateAdmin, MOROCCO_BOUNDS } from "@/lib/terrascope/morocco";
import { PROJECT_STATUS, type Project } from "@/lib/terrascope/projects";
import { selectionLabel, type BoundaryLevel, type TerritorySelection } from "@/lib/terrascope/regions";

const EASE = [0.22, 1, 0.36, 1] as const;

type LeafletNS = typeof Leaflet;

export type ExploreMapProps = {
  className?: string;
  delay?: number;
  level: BoundaryLevel;
  onLevelChange: (level: BoundaryLevel) => void;
  selection: TerritorySelection | null;
  onSelect: (selection: TerritorySelection) => void;
  /** Project markers to display (empty hides them). */
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (id: string) => void;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function popupHtml(p: Project) {
  return `<div class="ts-popup-body">
    <p class="ts-popup-eyebrow">${esc(p.categoryLabel)}</p>
    <h3 class="ts-popup-title">${esc(p.title)}</h3>
    <p class="ts-popup-text">${esc(p.description)}</p>
    <p class="ts-popup-meta"><span>Localisation suggérée</span>${esc(p.city)} · ${esc(p.region)}</p>
    <p class="ts-popup-status">${esc(PROJECT_STATUS)}</p>
  </div>`;
}

function markerIcon(L: LeafletNS, p: Project, active: boolean) {
  return L.divIcon({
    className: "ts-marker-wrap",
    html: `<span class="ts-marker${active ? " is-active" : ""}"><span>${p.number}</span></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

/**
 * Interactive Morocco map (Leaflet + OpenStreetMap tiles, tinted in CSS).
 * Opens on a world view, then flies to Morocco; regions or provinces can be selected
 * and sample-project markers are kept in sync with the surrounding UI.
 */
export function ExploreMap({
  className,
  delay = 0.35,
  level,
  onLevelChange,
  selection,
  onSelect,
  projects,
  activeProjectId,
  onProjectSelect,
}: ExploreMapProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<LeafletNS | null>(null);
  const boundaryLayers = useRef(new Map<string, Leaflet.Polygon>());
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const [ready, setReady] = useState(false);
  const [boundaryVersion, setBoundaryVersion] = useState(0);

  // Latest callbacks/props without re-binding Leaflet handlers.
  const onSelectRef = useRef(onSelect);
  const onProjectRef = useRef(onProjectSelect);
  const levelRef = useRef(level);
  onSelectRef.current = onSelect;
  onProjectRef.current = onProjectSelect;
  levelRef.current = level;

  // ---- Init map ----
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    let timer: number | undefined;

    // Leaflet touches `window` on import, so load it only in the browser.
    import("leaflet").then(({ default: L }) => {
      const el = containerRef.current;
      if (cancelled || !el) return;

      const map = L.map(el, {
        center: [20, 0],
        zoom: reduce ? 2 : 1,
        minZoom: 1,
        maxZoom: 18,
        zoomControl: false,
        worldCopyJump: true,
        maxBounds: [
          [-85, -240],
          [85, 240],
        ],
        maxBoundsViscosity: 0.8,
      });
      map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Limites : geoBoundaries',
      }).addTo(map);
      L.control.zoom({ position: "bottomright", zoomInTitle: "Zoom avant", zoomOutTitle: "Zoom arrière" }).addTo(map);

      loadBoundaries("country")
        .then((country) => {
          if (cancelled) return;
          L.geoJSON(country as never, { interactive: false, style: { className: "ts-country" } }).addTo(map);
        })
        .catch(() => {});

      LRef.current = L;
      mapRef.current = map;
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(el);
      setReady(true);

      if (reduce) {
        map.fitBounds(MOROCCO_BOUNDS, { padding: [24, 24] });
      } else {
        timer = window.setTimeout(() => {
          if (!cancelled) map.flyToBounds(MOROCCO_BOUNDS, { padding: [24, 24], duration: 2.4, easeLinearity: 0.2 });
        }, (delay + 0.6) * 1000);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [reduce, delay]);

  // ---- Regions / provinces layer ----
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;
    let cancelled = false;
    let layer: Leaflet.GeoJSON | undefined;

    loadBoundaries(level).then((data) => {
      if (cancelled) return;
      boundaryLayers.current.clear();
      layer = L.geoJSON(data as never, {
        style: { className: "ts-boundary" },
        onEachFeature: (feature, l) => {
          const name = (feature.properties as { name: string }).name;
          const path = l as Leaflet.Polygon;
          boundaryLayers.current.set(name, path);
          path.bindTooltip(name, { sticky: true, direction: "top", className: "ts-tooltip", offset: [0, -8] });
          path.on("mouseover", () => path.getElement()?.classList.add("is-hover"));
          path.on("mouseout", () => path.getElement()?.classList.remove("is-hover"));
          path.on("click", async (e: Leaflet.LeafletMouseEvent) => {
            if (levelRef.current === "regions") {
              onSelectRef.current({ level: "region", region: name });
            } else {
              const admin = await locateAdmin(e.latlng.lat, e.latlng.lng).catch(() => undefined);
              onSelectRef.current({ level: "province", province: name, region: admin?.region });
            }
          });
        },
      }).addTo(map);
      layer.bringToBack();
      setBoundaryVersion((v) => v + 1);
    });

    return () => {
      cancelled = true;
      layer?.remove();
      boundaryLayers.current.clear();
    };
  }, [ready, level]);

  // ---- Highlight + frame the selection ----
  const selectedName = selection ? (level === "regions" ? selection.region : selection.province) : undefined;
  const lastFramed = useRef<string | undefined>(undefined);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let target: Leaflet.Polygon | undefined;
    boundaryLayers.current.forEach((l, name) => {
      const selected = name === selectedName;
      l.getElement()?.classList.toggle("is-selected", selected);
      if (selected) {
        target = l;
        l.bringToFront();
      }
    });
    const key = `${level}:${selectedName}`;
    if (target && lastFramed.current !== key) {
      lastFramed.current = key;
      map.flyToBounds(target.getBounds(), {
        padding: [48, 48],
        maxZoom: level === "provinces" ? 9 : 7,
        duration: reduce ? 0 : 1.2,
        animate: !reduce,
      });
    }
  }, [ready, selectedName, level, boundaryVersion, reduce]);

  // ---- Project markers ----
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;
    const group = L.layerGroup().addTo(map);
    markers.current.clear();
    for (const p of projects) {
      const m = L.marker([p.lat, p.lon], {
        icon: markerIcon(L, p, false),
        title: p.title,
        alt: `${p.number}. ${p.title}`,
        riseOnHover: true,
        keyboard: true,
      })
        .bindPopup(popupHtml(p), { className: "ts-popup", maxWidth: 280, minWidth: 220, autoPanPaddingTopLeft: [24, 72], autoPanPaddingBottomRight: [24, 24] })
        .on("click", () => onProjectRef.current(p.id))
        .addTo(group);
      markers.current.set(p.id, m);
    }
    return () => {
      group.remove();
      markers.current.clear();
    };
  }, [ready, projects]);

  // ---- Active project: restyle marker, fly to it, open its popup ----
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;
    for (const p of projects) {
      markers.current.get(p.id)?.setIcon(markerIcon(L, p, p.id === activeProjectId));
    }
    const m = activeProjectId ? markers.current.get(activeProjectId) : undefined;
    if (!m) return;
    m.setZIndexOffset(1000);
    const open = () => m.openPopup();
    const target = m.getLatLng();
    const zoom = Math.max(map.getZoom(), 7);
    if (map.getCenter().distanceTo(target) < 500 && map.getZoom() >= 7) {
      open();
    } else {
      map.once("moveend", open);
      map.flyTo(target, zoom, { duration: reduce ? 0 : 1.1, animate: !reduce });
    }
    return () => {
      map.off("moveend", open);
      m.setZIndexOffset(0);
    };
  }, [ready, activeProjectId, projects, reduce]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 48, clipPath: "inset(0% 0% 100% 0% round 2rem)" }}
      animate={{ opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0% round 2rem)" }}
      transition={{ duration: 1.4, delay, ease: EASE }}
      className={cn("explore-map-frame relative isolate overflow-hidden rounded-[2rem]", className)}
    >
      <div
        ref={containerRef}
        className="explore-map absolute inset-0"
        aria-label="Carte interactive du Maroc"
        role="region"
      />

      {!ready && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-forest/[0.03]" />}

      {/* Centered starting-point reticle — shown until a territory is chosen */}
      {!selection && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: delay + 1.3, ease: EASE }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2"
        >
          <span className="map-reticle">
            <span className="map-reticle-pulse" />
            <span className="map-reticle-pulse map-reticle-pulse-delayed" />
            <span className="map-reticle-dot" />
          </span>
        </motion.div>
      )}

      {/* Level switch */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: delay + 1, ease: EASE }}
        className="map-overlay absolute top-4 left-4 z-[600] flex items-center gap-1 rounded-full p-1"
        role="group"
        aria-label="Niveau de découpage"
      >
        <Layers aria-hidden="true" className="mx-2 size-4 text-forest/50" />
        {(["regions", "provinces"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onLevelChange(l)}
            aria-pressed={level === l}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-300",
              level === l ? "bg-primary text-primary-foreground" : "text-forest/65 hover:bg-forest/[0.06] hover:text-forest",
            )}
          >
            {l === "regions" ? "Régions" : "Provinces"}
          </button>
        ))}
      </motion.div>

      {/* Selected territory / hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: delay + 1.2, ease: EASE }}
        className="map-overlay pointer-events-none absolute bottom-4 left-4 z-[600] flex max-w-[calc(100%-6rem)] items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5"
        aria-live="polite"
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            selection ? "bg-primary text-primary-foreground" : "bg-forest/[0.06] text-forest/55",
          )}
        >
          <MapPin className="size-3.5" />
        </span>
        <span className="truncate text-xs font-semibold text-forest">
          {selection
            ? selectionLabel(selection)
            : level === "regions"
              ? "Cliquez sur une région"
              : "Cliquez sur une province"}
        </span>
      </motion.div>

      {/* Soft inner edge so tiles melt into the white page */}
      <div aria-hidden="true" className="explore-map-edge pointer-events-none absolute inset-0 z-[400] rounded-[2rem]" />
    </motion.div>
  );
}
