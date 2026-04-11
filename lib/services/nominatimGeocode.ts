const UA =
  process.env.NOMINATIM_USER_AGENT ??
  "OpenSpot/1.0 (https://openspot.es; contacto@soporte.openspot.local)";

export async function geocodeMunicipioSpain(
  query: string,
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const q = query.trim();
  if (q.length < 2) return null;

  const params = new URLSearchParams({
    q: `${q}, España`,
    format: "json",
    limit: "1",
    addressdetails: "0",
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { lat?: string; lon?: string; display_name?: string }[];
    const hit = data[0];
    if (!hit?.lat || !hit?.lon) return null;
    const lat = parseFloat(hit.lat);
    const lng = parseFloat(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return {
      lat,
      lng,
      displayName: hit.display_name ?? q,
    };
  } catch {
    return null;
  }
}
