import { auth } from "@/auth";
import { assertCanRunSearch, consumeSearchCredit } from "@/lib/billing/searchQuota";
import { prisma } from "@/lib/prisma";
import { runAnalysisPipeline } from "@/lib/services/runAnalysis";
import type { AnalysisResult } from "@/lib/types/analysis";
import {
  analyzeRequestSchema,
  type AnalyzeRequestInput,
} from "@/lib/validation/analyzeRequest";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AnalyzeResponse =
  | { ok: true; data: AnalysisResult; analysisId: string | null }
  | { ok: false; error: string; code?: string };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: "Debes iniciar sesión para analizar.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: "Datos no válidos" },
      { status: 422 },
    );
  }

  const input: AnalyzeRequestInput = parsed.data;

  const quota = await assertCanRunSearch(userId);
  if (!quota.ok) {
    return NextResponse.json<AnalyzeResponse>(
      {
        ok: false,
        error: quota.message,
        code: quota.code,
      },
      { status: 402 },
    );
  }

  try {
    const full = await runAnalysisPipeline({
      city: input.city,
      budget: input.budget,
      businessType: input.businessType,
      pinLat: input.pinLat,
      pinLng: input.pinLng,
      pinRadiusM: input.pinRadiusM,
    });

    await consumeSearchCredit(userId);

    let analysisId: string | null = null;
    try {
      const saved = await prisma.analysis.create({
        data: {
          userId,
          title: input.studyName ?? null,
          city: full.city,
          businessType: full.businessType,
          budget: full.budget,
          emailCapture: session.user.email ?? undefined,
          inputPayload: { ...input },
          resultPayload: full as unknown as object,
        },
      });
      analysisId = saved.id;
    } catch (e) {
      console.error("Prisma analysis save:", e);
    }

    return NextResponse.json<AnalyzeResponse>(
      { ok: true, data: full, analysisId },
      { status: 200 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al analizar";
    return NextResponse.json<AnalyzeResponse>(
      { ok: false, error: message },
      { status: message.includes("No encontramos") ? 404 : 500 },
    );
  }
}
