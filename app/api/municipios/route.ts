import { searchMunicipios } from "@/lib/ine/municipios";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(40, Math.max(1, Number(searchParams.get("limit")) || 20));
  try {
    const hits = await searchMunicipios(q, limit);
    return NextResponse.json({ ok: true as const, data: hits });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false as const, error: "No se pudo consultar el nomenclátor." },
      { status: 500 },
    );
  }
}
