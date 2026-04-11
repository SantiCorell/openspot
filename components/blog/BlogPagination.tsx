import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

export function BlogPagination({ currentPage, totalPages, basePath = "/blog" }: Props) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8"
      aria-label="Paginación del blog"
    >
      <div className="text-[13px] text-[var(--muted)]">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center gap-2">
        {prev ? (
          <Link
            href={href(prev)}
            className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[13px] font-semibold text-[var(--foreground)] shadow-sm transition-[box-shadow,transform] hover:border-[var(--border-strong)] active:scale-[0.98]"
          >
            ← Anterior
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-[13px] text-[var(--muted)] opacity-50">
            ← Anterior
          </span>
        )}
        {next ? (
          <Link
            href={href(next)}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/20 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
          >
            Siguiente →
          </Link>
        ) : (
          <span className="rounded-full px-4 py-2 text-[13px] text-[var(--muted)] opacity-50">
            Siguiente →
          </span>
        )}
      </div>
    </nav>
  );
}
