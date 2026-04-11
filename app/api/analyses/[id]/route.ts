import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const patchBody = z.object({
  title: z.string().min(0).max(120).transform((s) => (s.trim() === "" ? null : s.trim())),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos no válidos" }, { status: 422 });
  }

  const existing = await prisma.analysis.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
  }

  const updated = await prisma.analysis.update({
    where: { id },
    data: { title: parsed.data.title },
    select: { id: true, title: true },
  });

  return NextResponse.json({ ok: true, data: updated });
}
