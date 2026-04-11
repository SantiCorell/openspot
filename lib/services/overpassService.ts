import type { BusinessType } from "@/lib/types/analysis";
import { osmTagsForBusiness } from "@/lib/osm/osmTagsByBusiness";

const DEFAULT_OVERPASS =
  process.env.OVERPASS_API_URL ?? "https://overpass-api.de/api/interpreter";

type OverpassElement = { type: string; id: number };

/**
 * Cuenta nodos OSM únicos en un radio (m) que coinciden con las etiquetas del sector.
 * Solo nodos (MVP); ways/relations pueden subestimar competencia real.
 */
export async function countOsmCompetitorsNear(args: {
  lat: number;
  lng: number;
  radiusMeters: number;
  businessType: BusinessType;
}): Promise<{
  count: number;
  tagsUsed: string;
  attribution: string;
  error?: string;
}> {
  const { lat, lng, radiusMeters, businessType } = args;
  const tags = osmTagsForBusiness(businessType);
  const r = Math.min(5000, Math.max(50, Math.round(radiusMeters)));

  const lines: string[] = ["[out:json][timeout:25];", "("];
  for (const [k, v] of tags) {
    lines.push(`  node["${k}"="${v}"](around:${r},${lat},${lng});`);
  }
  lines.push(");", "out;");

  const query = lines.join("\n");

  try {
    const res = await fetch(DEFAULT_OVERPASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(22_000),
    });

    if (!res.ok) {
      return {
        count: 0,
        tagsUsed: tags.map(([a, b]) => `${a}=${b}`).join(", "),
        attribution: "OpenStreetMap contributors (ODbL)",
        error: `Overpass HTTP ${res.status}`,
      };
    }

    const json = (await res.json()) as { elements?: OverpassElement[] };
    const elements = json.elements ?? [];
    const ids = new Set<number>();
    for (const el of elements) {
      if (el.type === "node" && typeof el.id === "number") ids.add(el.id);
    }

    return {
      count: ids.size,
      tagsUsed: tags.map(([a, b]) => `${a}=${b}`).join(", "),
      attribution: "© OpenStreetMap contributors (ODbL)",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Overpass error";
    return {
      count: 0,
      tagsUsed: tags.map(([a, b]) => `${a}=${b}`).join(", "),
      attribution: "© OpenStreetMap contributors (ODbL)",
      error: msg,
    };
  }
}
