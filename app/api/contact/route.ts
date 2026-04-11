import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(8000),
});

export async function POST(req: Request) {
  const session = await auth();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Revisa los campos." }, { status: 422 });
  }

  await prisma.contactSubmission.create({
    data: {
      userId: session?.user?.id ?? null,
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      subject: parsed.data.subject.trim(),
      message: parsed.data.message.trim(),
    },
  });

  return NextResponse.json({ ok: true as const });
}
