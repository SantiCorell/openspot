"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BUSINESS_GROUPS,
  BUSINESS_LABELS,
  type AnalysisResult,
  type BusinessType,
  isBusinessType,
} from "@/lib/types/analysis";

import { AnalyzePinMap } from "@/components/analyze/AnalyzePinMap";
import { ResultsPanel } from "@/components/analyze/ResultsPanel";
import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";
import { OpenSpotMark } from "@/components/brand/OpenSpotMark";

type IneHit = { n: string; c: string; p: number; y: number };

type QuotaProps = {
  balance: number;
  planTier: string;
  monthlyUsed: number;
  monthlyIncluded: number;
  extraCredits: number;
  /** Texto de cabecera desde el servidor (incluye mensaje admin ilimitado). */
  headline?: string;
  adminUnlimited?: boolean;
};

function quotaLabel(q: QuotaProps): string {
  if (q.headline) return q.headline;
  if (q.planTier === "free") {
    return `${q.balance} búsqueda${q.balance === 1 ? "" : "s"} gratuita${q.balance === 1 ? "" : "s"} restantes`;
  }
  const left = Math.max(0, q.monthlyIncluded - q.monthlyUsed);
  const extra = q.extraCredits > 0 ? ` · ${q.extraCredits} crédito(s) extra` : "";
  return `${left} de ${q.monthlyIncluded} búsquedas del mes${extra}`;
}

export function AnalyzeExperience({
  initialQuota,
  initialCity,
  initialBusinessType,
}: {
  initialQuota: QuotaProps;
  initialCity?: string | null;
  initialBusinessType?: string | null;
}) {
  const router = useRouter();
  const [quota, setQuota] = useState(initialQuota);

  useEffect(() => {
    setQuota(initialQuota);
  }, [initialQuota]);
  const [cityInput, setCityInput] = useState(
    initialCity?.trim() ? initialCity.trim() : "València",
  );
  const [suggestions, setSuggestions] = useState<IneHit[]>([]);
  const [picked, setPicked] = useState<IneHit | null>(null);
  const [budget, setBudget] = useState(85000);
  const [businessType, setBusinessType] = useState<BusinessType>(() => {
    const b = initialBusinessType?.trim();
    return b && isBusinessType(b) ? b : "gym";
  });
  const [phase, setPhase] = useState<"idle" | "loading" | "result" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [studyName, setStudyName] = useState("");
  const [useOsmPin, setUseOsmPin] = useState(false);
  const [pinRadiusM, setPinRadiusM] = useState(450);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 39.47,
    lng: -0.3763,
  });
  const [pin, setPin] = useState<{ lat: number; lng: number }>({
    lat: 39.47,
    lng: -0.3763,
  });
  const [lastAnalysisId, setLastAnalysisId] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => (picked?.n ?? cityInput).length >= 2 && budget >= 5000,
    [picked, cityInput, budget],
  );

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `/api/municipios?q=${encodeURIComponent(q.trim())}&limit=15`,
    );
    const json = (await res.json()) as { ok: boolean; data?: IneHit[] };
    if (json.ok && json.data) setSuggestions(json.data);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void fetchSuggestions(cityInput), 220);
    return () => clearTimeout(t);
  }, [cityInput, fetchSuggestions]);

  useEffect(() => {
    const c = initialCity?.trim();
    if (c) {
      setCityInput(c);
      setPicked(null);
    }
    const b = initialBusinessType?.trim();
    if (b && isBusinessType(b)) setBusinessType(b);
  }, [initialCity, initialBusinessType]);

  useEffect(() => {
    const name = picked?.n ?? cityInput.trim();
    if (name.length < 2) return;
    const t = setTimeout(() => {
      void (async () => {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(name)}`);
        const j = (await res.json()) as {
          ok?: boolean;
          lat?: number;
          lng?: number;
        };
        if (j.ok && typeof j.lat === "number" && typeof j.lng === "number") {
          setMapCenter({ lat: j.lat, lng: j.lng });
          if (useOsmPin) setPin({ lat: j.lat, lng: j.lng });
        }
      })();
    }, 400);
    return () => clearTimeout(t);
  }, [picked, cityInput, useOsmPin]);

  function toggleOsmPin(on: boolean) {
    setUseOsmPin(on);
    if (on) {
      setPin({ lat: mapCenter.lat, lng: mapCenter.lng });
    }
  }

  async function submit() {
    setError(null);
    setPhase("loading");
    const city = picked?.n ?? cityInput.trim();
    try {
      const body: Record<string, unknown> = { city, budget, businessType };
      const sn = studyName.trim();
      if (sn) body.studyName = sn;
      if (useOsmPin) {
        body.pinLat = pin.lat;
        body.pinLng = pin.lng;
        body.pinRadiusM = pinRadiusM;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as
        | { ok: true; data: AnalysisResult; analysisId?: string | null }
        | { ok: false; error: string; code?: string };

      if (res.status === 401) {
        setPhase("error");
        setError("Sesión caducada. Vuelve a entrar.");
        return;
      }
      if (res.status === 402) {
        setPhase("error");
        setError(data.ok === false ? data.error : "Sin búsquedas disponibles.");
        return;
      }
      if (!res.ok || !data.ok) {
        setPhase("error");
        setError("error" in data ? data.error : "Error al analizar");
        return;
      }

      setResult(data.data);
      setLastAnalysisId(data.analysisId ?? null);
      setPhase("result");
      router.refresh();
    } catch {
      setPhase("error");
      setError("Error de red. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:gap-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(100%,48rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,70,229,0.07),transparent_65%)]"
        aria-hidden
      />
      <section className="relative space-y-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm sm:block">
            <OpenSpotMark size={32} />
          </div>
          <div>
            <h1 className="text-[1.65rem] font-semibold tracking-tight sm:text-3xl">
              Analizador de ubicación
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
              Cualquier municipio español · padrón INE cruzado con millones de registros en
              nuestras BBDD analíticas · mapas de afluencia y saturación · informe con
              DeepSeek.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-3 text-[13px] font-medium text-[var(--foreground)]">
          {quotaLabel(quota)}
        </div>

        <div className="os-card space-y-5 p-6 sm:p-7">
          <div className="relative">
            <label className="block">
              <span className="text-[13px] font-medium text-[var(--foreground)]">
                Municipio (referencia INE + capas OpenSpot)
              </span>
              <input
                className="os-input mt-2"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setPicked(null);
                }}
                placeholder="Busca municipio…"
                autoComplete="off"
              />
            </label>
            {suggestions.length > 0 && !picked ? (
              <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 text-[13px] shadow-lg">
                {suggestions.map((s) => (
                  <li key={s.c}>
                    <button
                      type="button"
                      className="flex w-full flex-col px-3 py-2 text-left hover:bg-[var(--muted-bg)]"
                      onClick={() => {
                        setPicked(s);
                        setCityInput(s.n);
                        setSuggestions([]);
                      }}
                    >
                      <span className="font-medium">{s.n}</span>
                      <span className="text-[11px] text-[var(--muted)]">
                        INE {s.c} · {s.p.toLocaleString("es-ES")} hab. ({s.y})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <label className="block">
            <span className="text-[13px] font-medium text-[var(--foreground)]">
              Nombre del estudio (opcional)
            </span>
            <input
              className="os-input mt-2"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              placeholder="Ej. Franquicia cafetería — Madrid norte"
              maxLength={120}
            />
            <span className="mt-1 block text-[12px] text-[var(--muted)]">
              Aparece en tu historial y en el buscador del dashboard.
            </span>
          </label>

          <label className="block">
            <span className="text-[13px] font-medium text-[var(--foreground)]">
              Presupuesto (€)
            </span>
            <input
              type="number"
              min={5000}
              step={1000}
              className="os-input mt-2 tabular-nums"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </label>

          <label htmlFor="analyze-business-type" className="block">
            <span className="text-[13px] font-medium text-[var(--foreground)]">
              Tipo de negocio
            </span>
            <select
              id="analyze-business-type"
              className="os-select mt-2 w-full min-h-11"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
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

          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[var(--border)]"
                checked={useOsmPin}
                onChange={(e) => toggleOsmPin(e.target.checked)}
              />
              <span>
                <span className="text-[13px] font-medium text-[var(--foreground)]">
                  Competencia en un punto (OpenStreetMap)
                </span>
                <span className="mt-1 block text-[12px] leading-relaxed text-[var(--muted)]">
                  Coloca un pin y un radio: contamos nodos OSM en esa área y lo fusionamos con el
                  modelo (sin Google Places). El mapa se centra en el municipio cuando lo
                  reconocemos.
                </span>
              </span>
            </label>
            {useOsmPin ? (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-[12px] font-medium text-[var(--foreground)]">
                    Radio (metros): {pinRadiusM}
                  </span>
                  <input
                    type="range"
                    min={80}
                    max={2000}
                    step={20}
                    className="mt-2 w-full accent-[var(--accent)]"
                    value={pinRadiusM}
                    onChange={(e) => setPinRadiusM(Number(e.target.value))}
                  />
                </label>
                <AnalyzePinMap
                  centerLat={mapCenter.lat}
                  centerLng={mapCenter.lng}
                  pinLat={pin.lat}
                  pinLng={pin.lng}
                  radiusM={pinRadiusM}
                  onPinChange={(lat, lng) => setPin({ lat, lng })}
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="space-y-2 rounded-xl border border-red-500/25 bg-red-500/5 px-3 py-2 text-[13px] text-red-700 dark:text-red-300">
              <p>{error}</p>
              {error.includes("agotado") || error.includes("cup") ? (
                <a
                  href="/pricing"
                  className="inline-block font-semibold text-indigo-600 underline dark:text-indigo-400"
                >
                  Ver planes y créditos
                </a>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            disabled={!canSubmit || phase === "loading"}
            onClick={() => void submit()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] text-[14px] font-semibold text-[var(--background)] shadow-md transition-[opacity,transform] hover:opacity-92 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99]"
          >
            {phase === "loading" ? "Generando informe…" : "Generar informe completo"}
            <ArrowRightIcon className="opacity-90" />
          </button>
          <p className="text-[12px] leading-relaxed text-[var(--muted)]">
            Requiere sesión. Cada ejecución cuenta como una búsqueda según tu
            plan.
          </p>
        </div>
      </section>

      <section className="relative space-y-6">
        {phase === "loading" ? (
          <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.07] to-cyan-500/[0.04] px-6 py-10 text-center sm:px-10 sm:py-12">
            <div
              className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--border)] border-t-indigo-500"
              aria-hidden
            />
            <p className="mt-6 text-[1.15rem] font-semibold tracking-tight sm:text-xl">
              Generando tu informe…
            </p>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--muted)]">
              Tiempo orientativo: <strong className="text-[var(--foreground)]">45–90 segundos</strong>.
              Cruzamos padrón INE, señales de competencia, alquileres modelo y, si está activa, IA
              narrativa.
            </p>
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)]/80 px-4 py-3 text-[13px] leading-relaxed text-[var(--foreground)]">
              Puedes <strong>cerrar esta pestaña</strong>: al terminar, el estudio quedará guardado en
              tu historial.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-6 text-[14px] font-semibold shadow-sm transition-colors hover:border-indigo-500/30"
            >
              Ir a mi historial
            </Link>
          </div>
        ) : phase === "result" && result ? (
          <ResultsPanel result={result} analysisId={lastAnalysisId} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted-bg)]/35 px-8 py-16 text-center">
            <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm">
              <OpenSpotMark size={40} variant="mono" className="text-[var(--muted)]" />
            </div>
            <p className="max-w-xs text-[15px] leading-relaxed text-[var(--muted)]">
              El informe incluye señales de datos, saturación, locales tipo
              Idealista y narrativa DeepSeek.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
