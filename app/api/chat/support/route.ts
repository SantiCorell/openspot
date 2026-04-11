import { NextResponse } from "next/server";
import { z } from "zod";

import { getDeepSeek } from "@/lib/ai/deepseek";
import { isSupportChatAgentName } from "@/lib/chat/supportAgentNames";
import { buildSupportChatSystemPrompt } from "@/lib/chat/supportChatSystemPrompt";

export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(3500),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).max(20),
  agentName: z.string().min(2).max(40),
});

export async function POST(req: Request) {
  const ds = getDeepSeek();
  if (!ds) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El asistente no está disponible ahora mismo. Prueba más tarde o usa la página de contacto.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Solicitud no válida" }, { status: 422 });
  }

  const { messages, agentName: rawName } = parsed.data;
  const agentName = rawName.trim();
  if (!isSupportChatAgentName(agentName)) {
    return NextResponse.json({ ok: false, error: "Solicitud no válida" }, { status: 422 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ ok: false, error: "Sin mensajes" }, { status: 422 });
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json({ ok: false, error: "El último mensaje debe ser del usuario" }, { status: 422 });
  }

  const system = buildSupportChatSystemPrompt(agentName);

  try {
    const completion = await ds.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 900,
      temperature: 0.45,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { ok: false, error: "Respuesta vacía. Inténtalo de nuevo." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, reply: text });
  } catch (e) {
    console.error("support chat", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo generar la respuesta. Inténtalo en unos segundos." },
      { status: 502 },
    );
  }
}
