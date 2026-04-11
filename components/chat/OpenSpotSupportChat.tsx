"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  pickRandomSupportAgentName,
  type SupportChatAgentName,
} from "@/lib/chat/supportAgentNames";

const INACTIVITY_MS = 4 * 60 * 1000;

type ChatMessage = { role: "user" | "assistant"; content: string };

export function OpenSpotSupportChat() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [agentName, setAgentName] = useState<SupportChatAgentName>(() =>
    pickRandomSupportAgentName(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const lastUserSentAtRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevAgentRef = useRef(agentName);

  const hasConversation = messages.length > 0;

  const resetSession = useCallback((reason: "inactivity" | "manual") => {
    setMessages([]);
    setDraft("");
    setError(null);
    setLoading(false);
    lastUserSentAtRef.current = null;
    const next = pickRandomSupportAgentName(prevAgentRef.current);
    prevAgentRef.current = next;
    setAgentName(next);
    if (reason === "inactivity") {
      setNotice("Por seguridad, tras 4 minutos sin tu respuesta el chat se ha borrado. Empezamos de nuevo.");
      window.setTimeout(() => setNotice(null), 8000);
    }
  }, []);

  useEffect(() => {
    if (!hasConversation || lastUserSentAtRef.current == null) return;

    const tick = () => {
      const t = lastUserSentAtRef.current;
      if (t == null || messages.length === 0) return;
      if (Date.now() - t > INACTIVITY_MS) {
        resetSession("inactivity");
      }
    };

    const id = window.setInterval(tick, 10_000);
    tick();
    return () => window.clearInterval(id);
  }, [hasConversation, messages.length, resetSession]);

  useEffect(() => {
    if (!panelOpen || !hasConversation || lastUserSentAtRef.current == null) return;
    const t = lastUserSentAtRef.current;
    if (Date.now() - t > INACTIVITY_MS) {
      resetSession("inactivity");
    }
  }, [panelOpen, hasConversation, resetSession]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send() {
    const text = draft.trim();
    if (!text || loading) return;

    setError(null);
    setDraft("");
    lastUserSentAtRef.current = Date.now();

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName,
          messages: nextMessages,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; reply?: string; error?: string };
      if (!res.ok || !data.ok || !data.reply) {
        setError(data.error ?? "No se pudo enviar el mensaje.");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
    } catch {
      setError("Error de red. Revisa la conexión.");
    } finally {
      setLoading(false);
    }
  }

  const intro = useMemo(
    () =>
      `Hola, soy ${agentName}. Pregúntame cómo funciona OpenSpot (análisis, comparador, planes o facturación). Esta conversación se borra si pasan más de 4 minutos sin que escribas — no guardamos el historial.`,
    [agentName],
  );

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {panelOpen ? (
        <div
          className="pointer-events-auto flex max-h-[min(520px,calc(100dvh-7rem))] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
          role="dialog"
          aria-label={`Chat de ayuda con ${agentName}`}
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] bg-gradient-to-br from-indigo-500/10 to-transparent px-4 py-3 dark:from-indigo-500/15">
            <div>
              <p className="text-[13px] font-semibold text-[var(--foreground)]">{agentName}</p>
              <p className="text-[11px] text-[var(--muted)]">Ayuda OpenSpot · chat privado</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-full px-2.5 py-1 text-[12px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                aria-label="Ocultar chat"
              >
                Ocultar
              </button>
            </div>
          </div>

          {notice ? (
            <div className="border-b border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] leading-snug text-amber-900 dark:text-amber-100">
              {notice}
            </div>
          ) : null}

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
            style={{ maxHeight: "min(340px, 45dvh)" }}
          >
            <p className="rounded-2xl rounded-bl-md bg-[var(--muted-bg)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--foreground)]">
              {intro}
            </p>
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}-${m.content.slice(0, 12)}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[92%] rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[var(--foreground)] text-[var(--background)]"
                      : "rounded-bl-md bg-[var(--muted-bg)] text-[var(--foreground)]"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {loading ? (
              <p className="text-[12px] text-[var(--muted)]">Escribiendo…</p>
            ) : null}
          </div>

          {error ? (
            <p className="px-4 text-[12px] text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          <div className="border-t border-[var(--border)] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Escribe tu pregunta…"
                maxLength={2000}
                className="os-input min-w-0 flex-1 rounded-2xl border-[var(--border)] text-[13px]"
                disabled={loading}
                aria-label="Mensaje"
              />
              <button
                type="button"
                disabled={loading || !draft.trim()}
                onClick={() => void send()}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--foreground)] px-4 text-[13px] font-semibold text-[var(--background)] disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[var(--muted)]">
              Solo orientación sobre OpenSpot.{" "}
              <Link href="/contacto" className="font-medium text-[var(--accent)] underline">
                Contacto
              </Link>
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] shadow-lg ring-4 ring-[var(--card)] transition-transform hover:scale-[1.04] active:scale-[0.98]"
        aria-expanded={panelOpen}
        aria-label={panelOpen ? "Cerrar panel de chat" : "Abrir chat de ayuda OpenSpot"}
      >
        {panelOpen ? (
          <span className="text-lg font-light" aria-hidden>
            ×
          </span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3C7.03 3 3 6.58 3 11c0 2.13 1.05 4.05 2.73 5.45L4.5 21l4.96-2.32C10.38 19.22 11.18 19.35 12 19.35 16.97 19.35 21 15.77 21 11.35 21 6.92 16.97 3 12 3Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
