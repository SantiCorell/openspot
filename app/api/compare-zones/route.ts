import { auth } from "@/auth";
import {
  assertCanRunComparison,
  consumeComparisonCredit,
} from "@/lib/billing/comparisonQuota";
import { prisma } from "@/lib/prisma";
import { compareMunicipalities } from "@/lib/services/compareMunicipalities";
import { generateZoneComparisonSummary } from "@/lib/services/aiAnalysisService";
import {
  compareZonesRequestSchema,
  type CompareZonesRequestInput,
} from "@/lib/validation/compareZonesRequest";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CompareZonesResponse =
  | {
      ok: true;
      data: Awaited<ReturnType<typeof compareMunicipalities>>;
      narrative: string;
    }
  | { ok: false; error: string; code?: string };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<CompareZonesResponse>(
      {
        ok: false,
        error: "Debes iniciar sesión para usar el comparador.",
        code: "UNAUTHORIZED",
      },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user) {
    return NextResponse.json<CompareZonesResponse>(
      { ok: false, error: "Usuario no encontrado." },
      { status: 401 },
    );
  }
  if (!user.creditWallet) {
    await prisma.creditWallet.create({
      data: { userId: user.id, balance: 3 },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<CompareZonesResponse>(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = compareZonesRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Datos no válidos";
    return NextResponse.json<CompareZonesResponse>(
      { ok: false, error: msg },
      { status: 422 },
    );
  }

  const input: CompareZonesRequestInput = parsed.data;

  const quota = await assertCanRunComparison(userId);
  if (!quota.ok) {
    return NextResponse.json<CompareZonesResponse>(
      { ok: false, error: quota.message, code: quota.code },
      { status: 402 },
    );
  }

  try {
    const data = await compareMunicipalities(
      input.municipalities,
      input.businessType,
    );
    const narrative = await generateZoneComparisonSummary(data);
    await consumeComparisonCredit(userId);
    return NextResponse.json<CompareZonesResponse>({
      ok: true,
      data,
      narrative,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "No se pudo completar la comparación.";
    return NextResponse.json<CompareZonesResponse>(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
