import Link from "next/link";

export type AnalysisRow = {
  id: string;
  title: string | null;
  city: string;
  businessType: string;
  budget: number;
  createdAt: Date;
};

export function AnalysesTable({ analyses }: { analyses: AnalysisRow[] }) {
  return (
    <div className="os-card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--muted-bg)] text-xs uppercase text-[var(--muted)]">
          <tr>
            <th className="px-4 py-2">Estudio</th>
            <th className="px-4 py-2">Ciudad</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Presupuesto</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2 w-28"> </th>
          </tr>
        </thead>
        <tbody>
          {analyses.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-[var(--muted)]"
              >
                Aún no hay análisis.{" "}
                <Link href="/analyze" className="text-indigo-600 underline dark:text-indigo-400">
                  Crear uno
                </Link>
              </td>
            </tr>
          ) : (
            analyses.map((a) => (
              <tr key={a.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                  {a.title?.trim() ? (
                    a.title
                  ) : (
                    <span className="text-[var(--muted)]">Sin nombre</span>
                  )}
                </td>
                <td className="px-4 py-3">{a.city}</td>
                <td className="px-4 py-3">{a.businessType}</td>
                <td className="px-4 py-3">{a.budget.toLocaleString("es-ES")} €</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {a.createdAt.toLocaleDateString("es-ES")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/analisis/${a.id}`}
                    className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    Ver informe
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
