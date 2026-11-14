export type LngLat = [number, number];
type Ring = LngLat[];
export type PolygonCoords = Ring[];
export type Geometry =
  | { type: "Polygon"; coordinates: PolygonCoords }
  | { type: "MultiPolygon"; coordinates: PolygonCoords[] };

const R = 6371008.8;
const toRad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in metres. */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Shortest distance (m) from a point to a polyline, using a local planar projection. */
export function distanceToPolyline(lat: number, lon: number, line: { lat: number; lon: number }[]) {
  if (line.length === 0) return Infinity;
  const kx = Math.cos(toRad(lat)) * 111320;
  const ky = 110574;
  const px = 0;
  const py = 0;
  let best = Infinity;
  for (let i = 0; i < line.length; i++) {
    const a = line[i]!;
    const ax = (a.lon - lon) * kx;
    const ay = (a.lat - lat) * ky;
    if (line.length === 1) return Math.hypot(ax, ay);
    if (i === line.length - 1) break;
    const b = line[i + 1]!;
    const bx = (b.lon - lon) * kx;
    const by = (b.lat - lat) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    best = Math.min(best, Math.hypot(ax + t * dx - px, ay + t * dy - py));
  }
  return best;
}

function inRing(lon: number, lat: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygon(lon: number, lat: number, poly: PolygonCoords) {
  if (!poly[0] || !inRing(lon, lat, poly[0])) return false;
  for (let h = 1; h < poly.length; h++) if (inRing(lon, lat, poly[h]!)) return false;
  return true;
}

export function pointInGeometry(lat: number, lon: number, g: Geometry) {
  if (g.type === "Polygon") return inPolygon(lon, lat, g.coordinates);
  return g.coordinates.some((p) => inPolygon(lon, lat, p));
}

export function formatCoord(lat: number, lon: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "O";
  return `${Math.abs(lat).toFixed(5)}° ${ns}, ${Math.abs(lon).toFixed(5)}° ${ew}`;
}

export function formatDistance(m: number) {
  if (!Number.isFinite(m)) return "—";
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`;
}
