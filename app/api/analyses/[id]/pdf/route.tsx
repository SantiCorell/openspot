import { auth } from "@/auth";
import { AnalysisPdfDocument } from "@/lib/pdf/AnalysisPdfDocument";
import { generatePdfInsights } from "@/lib/services/aiAnalysisService";
import { prisma } from "@/lib/prisma";
import type { AnalysisResult } from "@/lib/types/analysis";
import { renderToBuffer } from "@react-pdf/renderer";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await ctx.params;
  const row = await prisma.analysis.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, title: true, resultPayload: true },
  });

  if (!row?.resultPayload || typeof row.resultPayload !== "object") {
    return new Response("No encontrado", { status: 404 });
  }

  const result = row.resultPayload as unknown as AnalysisResult;
  const ai = await generatePdfInsights(result);
  const exportedAtLabel = new Date().toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const buffer = await renderToBuffer(
    <AnalysisPdfDocument
      result={result}
      ai={ai}
      studyTitle={row.title}
      exportedAtLabel={exportedAtLabel}
    />,
  );

  const safeSlug = (row.title ?? result.city)
    .replace(/[^\w\s-áéíóúñü]/gi, "")
    .trim()
    .slice(0, 40)
    .replace(/\s+/g, "-")
    .toLowerCase();

  const filename = `openspot-${safeSlug || id.slice(0, 8)}.pdf`;

  return new Response(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
