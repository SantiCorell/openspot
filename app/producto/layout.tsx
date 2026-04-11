import Link from "next/link";

const subNav = [
  { href: "/producto", label: "Visión general" },
  { href: "/producto/informes", label: "Informes" },
  { href: "/producto/datos", label: "Datos y fuentes" },
  { href: "/producto/resultados", label: "Entender resultados" },
  { href: "/producto/mapas", label: "Mapas y zonas" },
  { href: "/producto/motor", label: "Motor de puntuación" },
  { href: "/comparador", label: "Comparador de zonas" },
  { href: "/producto/comparador", label: "Demo Enterprise (gráficos)" },
] as const;

export default function ProductoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/producto"
            className="hidden shrink-0 text-[13px] font-bold text-[var(--foreground)] sm:block sm:pr-2"
          >
            Producto
          </Link>
          <nav
            className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Secciones del producto"
          >
            {subNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[12px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--muted-bg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
