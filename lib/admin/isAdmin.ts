/** Superadmin fijo del producto (además de ADMIN_EMAILS en .env). */
const BUILT_IN_SUPERADMINS = ["santiago.corellvidal@gmail.com"];

/**
 * Administradores vía variable de entorno (lista de emails, separados por coma o ;).
 * Ej.: ADMIN_EMAILS="tu@correo.com,otro@empresa.es"
 */
export function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  return raw
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  if (BUILT_IN_SUPERADMINS.includes(e)) return true;
  const admins = parseAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(e);
}
