// Builds a static route map (pins + connecting line over real OpenStreetMap
// tiles) entirely from free, no-signup services: Nominatim for geocoding
// region names, and OSM's standard tile server for the map imagery. Both
// require a proper identifying User-Agent and reasonable rate limiting per
// their usage policies — see geocode()'s throttle and the tile attribution
// baked into the output image.
//
// One shared pipeline (getRouteMapBuffer) feeds both the web <img> route
// (app/api/map/route.js) and the PDF (lib/pdf.js embeds the same PNG).

import sharp from "sharp";

const USER_AGENT = "JenVoyage/1.0 (bespoke travel itinerary site; contact via jenvoyage.vercel.app)";
const TILE_SIZE = 256;
const MARKER_COLOR = "#B8962E"; // brand gold
const MARKER_TEXT_COLOR = "#1C1A17"; // brand ink
const PATH_COLOR = "#1C3461"; // brand navy, matches headings elsewhere

// ── Geocoding ────────────────────────────────────────────────────────────────

const geocodeCache = new Map();
let lastNominatimCallAt = 0;

// Nominatim's usage policy caps unauthenticated use at ~1 request/second —
// this serialises calls with a minimum gap rather than firing them in
// parallel.
async function throttleNominatim() {
  const wait = Math.max(0, 1100 - (Date.now() - lastNominatimCallAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimCallAt = Date.now();
}

async function geocode(query) {
  const key = query.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  await throttleNominatim();
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) { geocodeCache.set(key, null); return null; }
    const data = await res.json();
    const result = data?.[0] ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
    geocodeCache.set(key, result);
    return result;
  } catch {
    geocodeCache.set(key, null);
    return null;
  }
}

// Geocodes each region name (with the destination country appended for
// context, e.g. "Siem Reap and Angkor, Cambodia") in order, skipping any
// that can't be resolved. Falls back to geocoding the destination alone if
// no region resolved at all.
export async function geocodeRoute(regionNames, destinationName) {
  const points = [];
  for (const name of regionNames || []) {
    if (!name) continue;
    const query = destinationName ? `${name}, ${destinationName}` : name;
    const coords = await geocode(query);
    if (coords) points.push({ name, ...coords });
  }
  if (!points.length && destinationName) {
    const coords = await geocode(destinationName);
    if (coords) points.push({ name: destinationName, ...coords });
  }
  return points;
}

// ── Web Mercator tile math ──────────────────────────────────────────────────

function lonToPixelX(lon, zoom) {
  return ((lon + 180) / 360) * TILE_SIZE * 2 ** zoom;
}
function latToPixelY(lat, zoom) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * TILE_SIZE * 2 ** zoom;
}

function chooseZoom(minLat, maxLat, minLon, maxLon, targetWidth, targetHeight) {
  const padding = 80; // px, keeps pins off the very edge
  for (let z = 15; z >= 1; z--) {
    const x1 = lonToPixelX(minLon, z);
    const x2 = lonToPixelX(maxLon, z);
    const y1 = latToPixelY(maxLat, z); // north = smaller Y
    const y2 = latToPixelY(minLat, z);
    if (x2 - x1 <= targetWidth - padding && y2 - y1 <= targetHeight - padding) return z;
  }
  return 1;
}

// ── Tile fetching ────────────────────────────────────────────────────────────

const tileCache = new Map();

async function fetchTile(x, y, z) {
  const n = 2 ** z;
  const wrappedX = ((x % n) + n) % n; // wrap around the antimeridian
  if (y < 0 || y >= n) return null; // no tiles above/below the poles
  const key = `${z}/${wrappedX}/${y}`;
  if (tileCache.has(key)) return tileCache.get(key);
  try {
    const url = `https://tile.openstreetmap.org/${z}/${wrappedX}/${y}.png`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) { tileCache.set(key, null); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    tileCache.set(key, buf);
    return buf;
  } catch {
    tileCache.set(key, null);
    return null;
  }
}

// ── Image assembly ──────────────────────────────────────────────────────────

// Renders a route map for the given points (already geocoded) as a PNG
// buffer: stitched OSM tiles, a connecting line in trip order, numbered
// pins, and the OpenStreetMap attribution its tile usage policy requires.
export async function renderRouteMap(points, { width = 640, height = 400 } = {}) {
  if (!points?.length) return null;

  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);

  const zoom = points.length === 1 ? 11 : chooseZoom(minLat, maxLat, minLon, maxLon, width, height);

  const centerPixelX = (lonToPixelX(minLon, zoom) + lonToPixelX(maxLon, zoom)) / 2;
  const centerPixelY = (latToPixelY(minLat, zoom) + latToPixelY(maxLat, zoom)) / 2;
  const originX = centerPixelX - width / 2;
  const originY = centerPixelY - height / 2;

  const tileXStart = Math.floor(originX / TILE_SIZE);
  const tileXEnd = Math.floor((originX + width) / TILE_SIZE);
  const tileYStart = Math.floor(originY / TILE_SIZE);
  const tileYEnd = Math.floor((originY + height) / TILE_SIZE);

  const tileCoords = [];
  for (let tx = tileXStart; tx <= tileXEnd; tx++) {
    for (let ty = tileYStart; ty <= tileYEnd; ty++) {
      tileCoords.push({ tx, ty });
    }
  }
  const tiles = await Promise.all(tileCoords.map(({ tx, ty }) => fetchTile(tx, ty, zoom)));
  const composites = tileCoords
    .map(({ tx, ty }, i) => ({ tile: tiles[i], tx, ty }))
    .filter(({ tile }) => tile)
    .map(({ tile, tx, ty }) => ({
      input: tile,
      left: Math.round(tx * TILE_SIZE - originX),
      top: Math.round(ty * TILE_SIZE - originY),
    }));

  const projected = points.map((p, i) => ({
    ...p,
    x: lonToPixelX(p.lon, zoom) - originX,
    y: latToPixelY(p.lat, zoom) - originY,
    n: i + 1,
  }));

  const pathD = projected.length > 1
    ? `<path d="M ${projected.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}" fill="none" stroke="${PATH_COLOR}" stroke-width="3" stroke-dasharray="2,6" stroke-linecap="round" />`
    : "";

  const pins = projected.map((p) => `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="11" fill="${MARKER_COLOR}" stroke="#FDFBF8" stroke-width="2" />
    <text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="bold" fill="${MARKER_TEXT_COLOR}" text-anchor="middle">${p.n}</text>
  `).join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${pathD}
      ${pins}
      <rect x="0" y="${height - 16}" width="${width}" height="16" fill="rgba(253,251,248,0.75)" />
      <text x="6" y="${height - 5}" font-family="Helvetica,Arial,sans-serif" font-size="10" fill="#4A3F35">© OpenStreetMap contributors</text>
    </svg>
  `;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 234, g: 228, b: 218, alpha: 1 } },
  });

  return base
    .composite([...composites, { input: Buffer.from(svg) }])
    .png()
    .toBuffer();
}

// Convenience one-shot: geocode the regions, then render the map. Returns
// null (rather than throwing) if nothing could be geocoded, so callers can
// just skip showing a map.
export async function getRouteMapBuffer(regionNames, destinationName, opts) {
  const points = await geocodeRoute(regionNames, destinationName);
  if (!points.length) return null;
  return renderRouteMap(points, opts);
}
