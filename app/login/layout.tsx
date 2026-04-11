/**
 * Shell ligero para login: safe-area en iOS y sensación de app a pantalla completa bajo el header global.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-safe-x flex min-h-0 flex-1 flex-col">{children}</div>;
}
