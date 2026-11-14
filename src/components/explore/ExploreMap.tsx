import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type * as Leaflet from "leaflet";
import { Layers, MapPin, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n, type I18nValue } from "@/lib/i18n";
import { CROP_CLASS_BREAKS, CROP_COUNT_BY_REGION, cropClass, primaryCategory } from "@/lib/terrascope/mapStats";
import { loadBoundaries, locateAdmin, MOROCCO_BOUNDS } from "@/lib/terrascope/morocco";
import type { Project } from "@/lib/terrascope/projects";
import type { BoundaryLevel, TerritorySelection } from "@/lib/terrascope/regions";

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

function popupHtml(p: Project, i18n: I18nValue) {
  const text = i18n.project(p);
  return `<div class="ts-popup-body" dir="${i18n.dir}">
    <p class="ts-popup-eyebrow">${esc(text.categoryLabel)}</p>
    <h3 class="ts-popup-title">${esc(text.title)}</h3>
    <p class="ts-popup-text">${esc(text.description)}</p>
    <p class="ts-popup-meta"><span>${esc(i18n.t.map.suggestedLocation)}</span>${esc(i18n.place(p.city))} · ${esc(i18n.place(p.region))}</p>
    <p class="ts-popup-status">${esc(i18n.t.projectStatus)}</p>
  </div>`;
}

function markerIcon(L: LeafletNS, p: Project, active: boolean) {
  return L.divIcon({
    className: "ts-marker-wrap",
    html: `<span class="ts-marker${active ? " is-active" : ""}" data-cat="${primaryCategory(p)}"><span>${p.number}</span></span>`,
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
  const i18n = useI18n();
  const { t, place } = i18n;
  const i18nRef = useRef(i18n);
  i18nRef.current = i18n;
  const [showCrops, setShowCrops] = useState(false);
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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

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
          path.bindTooltip(i18nRef.current.place(name), { sticky: true, direction: "top", className: "ts-tooltip", offset: [0, -8] });
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

  // ---- Language: tooltips, zoom buttons, attribution ----
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    boundaryLayers.current.forEach((l, name) => l.setTooltipContent(place(name)));
    const zoom = map.getContainer().querySelector(".leaflet-control-zoom");
    for (const [sel, label] of [
      [".leaflet-control-zoom-in", t.map.zoomIn],
      [".leaflet-control-zoom-out", t.map.zoomOut],
    ] as const) {
      const a = zoom?.querySelector(sel);
      a?.setAttribute("title", label);
      a?.setAttribute("aria-label", label);
    }
    map.attributionControl.addAttribution(t.map.attribution);
    return () => {
      map.attributionControl.removeAttribution(t.map.attribution);
    };
  }, [ready, boundaryVersion, place, t]);

  // ---- Crop-presence layer (regions only) ----
  useEffect(() => {
    if (!ready) return;
    boundaryLayers.current.forEach((l, name) => {
      const el = l.getElement();
      if (!el) return;
      for (let c = 0; c <= 5; c++) el.classList.remove(`ts-crop-${c}`);
      if (showCrops && level === "regions") el.classList.add(`ts-crop-${cropClass(CROP_COUNT_BY_REGION[name] ?? 0)}`);
    });
  }, [ready, showCrops, level, boundaryVersion]);

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
        .bindPopup(popupHtml(p, i18nRef.current), { className: "ts-popup", maxWidth: 280, minWidth: 220, autoPanPaddingTopLeft: [24, 72], autoPanPaddingBottomRight: [24, 24] })
        .on("click", () => onProjectRef.current(p.id))
        .addTo(group);
      markers.current.set(p.id, m);
    }
    return () => {
      group.remove();
      markers.current.clear();
    };
  }, [ready, projects, i18n.lang]);

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
  }, [ready, activeProjectId, projects, reduce, i18n.lang]);

  const selectionName = selection ? place(selection.level === "province" ? selection.province : selection.region) : "";
  const legendCategories = [...new Set(projects.map(primaryCategory))];
  const cropLegend = showCrops && level === "regions";

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
        aria-label={t.map.aria}
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
        className="absolute start-4 top-4 z-[600] flex flex-wrap items-center gap-2"
      >
        <div className="map-overlay flex items-center gap-1 rounded-full p-1" role="group" aria-label={t.map.levelGroup}>
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
            {l === "regions" ? t.map.regions : t.map.provinces}
          </button>
        ))}
        </div>
        {level === "regions" && (
          <button
            type="button"
            onClick={() => setShowCrops((v) => !v)}
            aria-pressed={showCrops}
            className={cn("map-overlay map-toggle", showCrops && "is-on")}
          >
            <Sprout aria-hidden="true" className="size-3.5" />
            {t.map.cropLayer}
          </button>
        )}
      </motion.div>

      {/* Legend — only lists what is actually drawn */}
      {(selection || cropLegend || legendCategories.length > 0) && (
        <div className="map-overlay map-legend absolute end-4 top-4 z-[600] hidden w-52 rounded-2xl p-3 sm:block" aria-label={t.map.legend}>
          <p className="map-legend-title">{t.map.legend}</p>
          <ul className="mt-2 space-y-1.5">
            {selection && (
              <li className="map-legend-row">
                <span className="map-swatch is-select" />
                {t.map.legendSelected}
              </li>
            )}
            <li className="map-legend-row">
              <span className="map-swatch is-line" />
              {t.map.legendBoundary}
            </li>
          </ul>
          {cropLegend && (
            <div className="mt-3">
              <p className="map-legend-sub">{t.map.cropsScaleTitle}</p>
              <div className="mt-1.5 flex gap-0.5" dir="ltr">
                {[0, ...CROP_CLASS_BREAKS.map((b) => b.cls)].map((c) => (
                  <span key={c} className={cn("map-ramp", `is-c${c}`)} />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-forest/55" dir="ltr">
                <span>0</span>
                {CROP_CLASS_BREAKS.map((b) => (
                  <span key={b.cls}>{b.min === b.max ? b.min : `${b.min}+`}</span>
                ))}
              </div>
            </div>
          )}
          {legendCategories.length > 0 && (
            <div className="mt-3">
              <p className="map-legend-sub">{t.map.legendProjects}</p>
              <ul className="mt-1.5 space-y-1">
                {legendCategories.map((c) => (
                  <li key={c} className="map-legend-row">
                    <span className="map-dot" data-cat={c} />
                    {t.projectCategory[c]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Selected territory / hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: delay + 1.2, ease: EASE }}
        className="map-overlay pointer-events-none absolute start-4 bottom-4 z-[600] flex max-w-[calc(100%-6rem)] items-center gap-2.5 rounded-full py-2 ps-2.5 pe-4"
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
            ? selectionName || t.location.selectedFallback
            : level === "regions"
              ? t.map.clickRegion
              : t.map.clickProvince}
        </span>
      </motion.div>

      {/* Soft inner edge so tiles melt into the white page */}
      <div aria-hidden="true" className="explore-map-edge pointer-events-none absolute inset-0 z-[400] rounded-[2rem]" />
    </motion.div>
  );
}
