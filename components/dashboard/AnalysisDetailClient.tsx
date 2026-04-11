"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResultsPanel } from "@/components/analyze/ResultsPanel";
import type { AnalysisResult } from "@/lib/types/analysis";

export function AnalysisDetailClient({
  analysisId,
  initialTitle,
  createdAtLabel,
  result,
}: {
  analysisId: string;
  initialTitle: string | null;
  createdAtLabel: string;
  result: AnalysisResult;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function saveTitle() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/analyses/${analysisId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) {
        setMsg(j.error ?? "No se pudo guardar");
        return;
      }
      setMsg("Nombre actualizado.");
      router.refresh();
    } catch {
      setMsg("Error de red");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <label className="block text-[13px] font-medium text-[var(--foreground)]">
            Nombre del estudio
          </label>
          <input
            className="os-input w-full max-w-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Gimnasio Ruzafa — Q2 2026"
            maxLength={120}
          />
          <p className="text-[12px] text-[var(--muted)]">
            Creado {createdAtLabel}. Aparece en el buscador del dashboard.
          </p>
          {msg ? (
            <p className="text-[13px] text-[var(--muted)]">{msg}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveTitle()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--foreground)] px-5 text-[13px] font-semibold text-[var(--background)] disabled:opacity-40"
          >
            {saving ? "Guardando…" : "Guardar nombre"}
          </button>
          <a
            href={`/api/analyses/${analysisId}/pdf`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted-bg)] px-5 text-[13px] font-semibold text-[var(--foreground)]"
          >
            Exportar PDF
          </a>
        </div>
      </div>

      <ResultsPanel result={result} showHistoryLink={false} />
    </div>
  );
}
