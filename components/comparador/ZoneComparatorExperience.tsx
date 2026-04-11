"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BUSINESS_GROUPS,
  BUSINESS_LABELS,
  type BusinessType,
  isBusinessType,
} from "@/lib/types/analysis";
import type { CompareMunicipalitiesResult } from "@/lib/services/compareMunicipalities";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";
import { OpenSpotMark } from "@/components/brand/OpenSpotMark";

type IneHit = { n: string; c: string; p: number; y: number };

type QuotaProps = {
  headline: string;
  planTier: string;
};

const MAX_ZONES = 6;
const MIN_ZONES = 2;

export function ZoneComparatorExperience({ initialQuota }: { initialQuota: QuotaProps }) {
  const router = useRouter();
  const [quota, setQuota] = useState(initialQuota);
  useEffect(() => {
    setQuota(initialQuota);
  }, [initialQuota]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<IneHit[]>([]);
  const [pickedList, setPickedList] = useState<IneHit[]>([]);
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [phase, setPhase] = useState<"idle" | "loading" | "result" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareMunicipalitiesResult | null>(null);
  const [narrative, setNarrative] = useState<string>("");

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `/api/municipios?q=${encodeURIComponent(q.trim())}&limit=18`,
    );
    const json = (await res.json()) as { ok: boolean; data?: IneHit[] };
    if (json.ok && json.data) setSuggestions(json.data);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void fetchSuggestions(search), 200);
    return () => clearTimeout(t);
  }, [search, fetchSuggestions]);

  function addMunicipio(hit: IneHit) {
    if (pickedList.some((p) => p.c === hit.c)) return;
    if (pickedList.length >= MAX_ZONES) return;
    setPickedList((prev) => [...prev, hit]);
    setSearch("");
    setSuggestions([]);
  }

  function removeMunicipio(code: string) {
    setPickedList((prev) => prev.filter((p) => p.c !== code));
  }

  const canCompare = useMemo(
    () => pickedList.length >= MIN_ZONES && phase !== "loading",
    [pickedList.length, phase],
  );

  async function runCompare() {
    setError(null);
    setPhase("loading");
    try {
      const res = await fetch("/api/compare-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          municipalities: pickedList.map((p) => p.n),
          businessType,
        }),
      });
      const data = (await res.json()) as
        | { ok: true; data: CompareMunicipalitiesResult; narrative: string }
        | { ok: false; error: string; code?: string };

      if (res.status === 401) {
        setPhase("error");
        setError("Sesión caducada. Vuelve a entrar.");
        return;
      }
      if (res.status === 402) {
        setPhase("error");
        setError(data.ok === false ? data.error : "Sin comparaciones disponibles.");
        return;
      }
      if (!res.ok || !data.ok) {
        setPhase("error");
        setError("error" in data ? data.error : "Error al comparar");
        return;
      }

      setResult(data.data);
      setNarrative(data.narrative);
      setPhase("result");
      router.refresh();
    } catch {
      setPhase("error");
      setError("Error de red. Inténtalo de nuevo.");
    }
  }

  const winners = result?.winners ?? [];

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100%,56rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.12),transparent_68%)]"
        aria-hidden
      />

      <header className="relative mx-auto max-w-3xl text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-indigo-500/5 p-3 shadow-sm">
            <OpenSpotMark size={40} />
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Comparador multi-zona
        </p>
        <h1 className="mt-3 text-[1.75rem] font-semibold tracking-tight sm:text-4xl">
          Elige municipios. Mismo sector.{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-400">
            Decide dónde tiene más sentido.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Hasta {MAX_ZONES} municipios a la vez (INE + motor OpenSpot). Te mostramos población,
          competidores modelados por municipio y una lectura ejecutiva con los dos candidatos
          ganadores para pasarlos al{" "}
          <Link href="/analyze" className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
            análisis completo
          </Link>
          .
        </p>
      </header>

      <div className="relative mx-auto mt-10 max-w-3xl">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-center text-[13px] font-medium text-[var(--foreground)]">
          {quota.headline}
        </div>
      </div>

      <div className="relative mx-auto mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <section className="space-y-6">
          <div className="os-card space-y-5 p-6 sm:p-7">
            <div>
              <span className="text-[13px] font-medium text-[var(--foreground)]">
                Municipios ({pickedList.length}/{MAX_ZONES})
              </span>
              <p className="mt-1 text-[12px] text-[var(--muted)]">
                Ej.: València, Rocafort, Massarrojos… Mínimo {MIN_ZONES}.
              </p>
              <div className="relative mt-3">
                <input
                  className="os-input w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar en el nomenclátor INE…"
                  autoComplete="off"
                  disabled={pickedList.length >= MAX_ZONES}
                />
                {suggestions.length > 0 && pickedList.length < MAX_ZONES ? (
                  <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 text-[13px] shadow-lg">
                    {suggestions.map((s) => (
                      <li key={s.c}>
                        <button
                          type="button"
                          className="flex w-full flex-col px-3 py-2 text-left hover:bg-[var(--muted-bg)]"
                          onClick={() => addMunicipio(s)}
                        >
                          <span className="font-medium">{s.n}</span>
                          <span className="text-[11px] text-[var(--muted)]">
                            INE {s.c} · {s.p.toLocaleString("es-ES")} hab.
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {pickedList.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {pickedList.map((p) => (
                  <li
                    key={p.c}
                    className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted-bg)]/50 py-1.5 pl-3 pr-2 text-[13px]"
                  >
                    <span className="font-medium">{p.n}</span>
                    <button
                      type="button"
                      className="flex h-11 min-w-11 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)] touch-manipulation"
                      aria-label={`Quitar ${p.n}`}
                      onClick={() => removeMunicipio(p.c)}
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        ×
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[var(--muted)]">
                Aún no has añadido municipios.
              </p>
            )}

            <label htmlFor="comparator-business-type" className="block">
              <span className="text-[13px] font-medium text-[var(--foreground)]">
                Tipo de negocio
              </span>
              <select
                id="comparator-business-type"
                className="os-select mt-2 w-full min-h-11"
                value={businessType}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isBusinessType(v)) setBusinessType(v);
                }}
              >
                {BUSINESS_GROUPS.map((g) => (
                  <optgroup key={g.title} label={g.title}>
                    {g.items.map((id) => (
                      <option key={id} value={id}>
                        {BUSINESS_LABELS[id]}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            {error ? (
              <div className="space-y-2 rounded-xl border border-red-500/25 bg-red-500/5 px-3 py-2 text-[13px] text-red-700 dark:text-red-300">
                <p>{error}</p>
                {error.includes("comparaciones") || error.includes("agotado") ? (
                  <Link
                    href="/pricing"
                    className="inline-block font-semibold text-indigo-600 underline dark:text-indigo-400"
                  >
                    Ver planes y créditos
                  </Link>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!canCompare}
              onClick={() => void runCompare()}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 text-[15px] font-semibold text-white shadow-lg transition-[opacity,transform] hover:opacity-95 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99] dark:from-cyan-500 dark:to-indigo-500"
            >
              {phase === "loading" ? "Cruzando datos…" : "Comparar municipios"}
              <ArrowRightIcon className="opacity-95" />
            </button>
            <p className="text-[12px] leading-relaxed text-[var(--muted)]">
              Cada ejecución cuenta como una comparación según tu plan (Free: 3 en total · Pro:
              10/mes · Enterprise: 50/mes). Las cifras son modelos orientativos OpenSpot.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {phase !== "result" || !result ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-500/25 bg-gradient-to-b from-cyan-500/[0.04] to-transparent px-8 py-16 text-center">
              <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
                Aquí verás la tabla comparativa, el ranking por oportunidad modelada y un texto
                ejecutivo (DeepSeek cuando hay API key) para decidir en qué municipios merece la
                pena profundizar.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {winners.map((w, i) => (
                  <div
                    key={w.city}
                    className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-transparent p-5 shadow-sm"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {i === 0 ? "Mejor encaje" : "Segunda opción"}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight">{w.city}</h3>
                    <dl className="mt-4 space-y-2 text-[13px] text-[var(--muted)]">
                      <div className="flex justify-between gap-2">
                        <dt>Población (INE)</dt>
                        <dd className="font-semibold tabular-nums text-[var(--foreground)]">
                          {w.population.toLocaleString("es-ES")} hab.
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Competidores modelados</dt>
                        <dd className="font-semibold tabular-nums text-[var(--foreground)]">
                          ~{w.modeledBusinessesTotal}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Hab. / competidor (aprox.)</dt>
                        <dd className="font-semibold tabular-nums text-[var(--foreground)]">
                          ~{w.inhabitantsPerModeledBusiness.toLocaleString("es-ES")}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Oportunidad (score)</dt>
                        <dd className="font-semibold text-cyan-700 dark:text-cyan-300">
                          {w.opportunityScore}/100
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/analyze?city=${encodeURIComponent(w.city)}&business=${encodeURIComponent(businessType)}`}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-[13px] font-semibold transition-colors hover:border-indigo-500/40 hover:bg-[var(--muted-bg)]"
                    >
                      Estudio completo en {w.city}
                      <ArrowRightIcon className="h-4 w-4 opacity-80" />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="os-card overflow-hidden p-0">
                <div className="border-b border-[var(--border)] bg-[var(--muted-bg)]/40 px-4 py-3">
                  <h3 className="text-[14px] font-semibold">
                    Sector: {BUSINESS_LABELS[businessType]}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                        <th className="px-4 py-3 font-semibold">#</th>
                        <th className="px-4 py-3 font-semibold">Municipio</th>
                        <th className="px-4 py-3 font-semibold tabular-nums">Hab.</th>
                        <th className="px-4 py-3 font-semibold tabular-nums">Compet.</th>
                        <th className="px-4 py-3 font-semibold tabular-nums">Hab./comp.</th>
                        <th className="px-4 py-3 font-semibold tabular-nums">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((r) => (
                        <tr
                          key={r.ineCode}
                          className="border-b border-[var(--border)]/60 hover:bg-[var(--muted-bg)]/30"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--muted)]">
                            {r.rank}
                          </td>
                          <td className="px-4 py-3 font-medium">{r.city}</td>
                          <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                            {r.population.toLocaleString("es-ES")}
                          </td>
                          <td className="px-4 py-3 tabular-nums">~{r.modeledBusinessesTotal}</td>
                          <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                            ~{r.inhabitantsPerModeledBusiness.toLocaleString("es-ES")}
                          </td>
                          <td className="px-4 py-3 font-semibold text-cyan-700 dark:text-cyan-300">
                            {r.opportunityScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <article className="os-card border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.04] to-transparent p-6 sm:p-8">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-400">
                  Lectura ejecutiva
                </h3>
                <p className="mt-4 text-[15px] leading-[1.75] text-[var(--foreground)]">
                  {narrative}
                </p>
                {winners.length >= 2 ? (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/analyze?city=${encodeURIComponent(winners[0].city)}&business=${encodeURIComponent(businessType)}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-[14px] font-semibold text-[var(--background)] shadow-md hover:opacity-92"
                    >
                      Priorizar {winners[0].city}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/analyze?city=${encodeURIComponent(winners[1].city)}&business=${encodeURIComponent(businessType)}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-[14px] font-semibold hover:bg-[var(--muted-bg)]"
                    >
                      Estudio en {winners[1].city}
                      <ArrowRightIcon className="h-4 w-4 opacity-70" />
                    </Link>
                  </div>
                ) : null}
              </article>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
