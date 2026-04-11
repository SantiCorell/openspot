import { geocodeMunicipioSpain } from "@/lib/services/nominatimGeocode";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Res =
  | { ok: true; lat: number; lng: number; displayName: string }
  | { ok: false; error: string };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json<Res>({ ok: false, error: "Consulta demasiado corta" }, { status: 400 });
  }

  const hit = await geocodeMunicipioSpain(q);
  if (!hit) {
    return NextResponse.json<Res>({ ok: false, error: "Sin resultados" }, { status: 404 });
  }

  return NextResponse.json<Res>({
    ok: true,
    lat: hit.lat,
    lng: hit.lng,
    displayName: hit.displayName,
  });
}
