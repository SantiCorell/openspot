import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const schema = z.object({
  companyName: z.string().max(200).optional(),
  taxId: z.string().max(80).optional(),
  address: z.string().max(2000).optional(),
  notes: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos no válidos" }, { status: 422 });
  }

  await prisma.invoiceRequest.create({
    data: {
      userId: session.user.id,
      companyName: parsed.data.companyName?.trim() || null,
      taxId: parsed.data.taxId?.trim() || null,
      address: parsed.data.address?.trim() || null,
      notes: parsed.data.notes?.trim() || null,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true as const });
}
