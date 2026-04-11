import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  /** Solo dev: URL + opciones SSL para recrear pool si cambia .env */
  poolKey: string | undefined;
};

function assertDatabaseUrl(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida");
  }
  if (connectionString.startsWith("prisma+")) {
    throw new Error(
      "Usa una URL postgresql:// estándar con Prisma 7 y el adapter pg (ver .env.example).",
    );
  }
  return connectionString;
}

/** Huella para invalidar el singleton en dev (URL + política SSL). */
function devPoolKey(connectionString: string): string {
  return `${connectionString}\0ssl_reject=${process.env.DATABASE_SSL_REJECT_UNAUTHORIZED ?? "default"}`;
}

/**
 * Con `pg` reciente, `sslmode=require` en la URL equivale a verify-full y fuerza la cadena de
 * confianza del sistema → un MITM local (antivirus) rompe aunque pases `rejectUnauthorized: false`.
 * Si relajamos SSL, quitamos sslmode y dejamos solo la opción `ssl` del Pool.
 */
function stripSslModeQueryParam(url: string): string {
  const q = url.indexOf("?");
  if (q === -1) return url;
  const base = url.slice(0, q);
  const params = new URLSearchParams(url.slice(q + 1));
  if (!params.has("sslmode")) return url;
  params.delete("sslmode");
  const tail = params.toString();
  return tail ? `${base}?${tail}` : base;
}

function createPrismaClient(connectionString: string): PrismaClient {
  const relaxSslVerify =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";

  const connectionStringForPool = relaxSslVerify
    ? stripSslModeQueryParam(connectionString)
    : connectionString;

  const pool = new Pool({
    connectionString: connectionStringForPool,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    ...(relaxSslVerify ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
    globalForPrisma.poolKey = devPoolKey(connectionString);
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function disposeDevClient(): void {
  void globalForPrisma.pool?.end().catch(() => undefined);
  void globalForPrisma.prisma?.$disconnect().catch(() => undefined);
  globalForPrisma.pool = undefined;
  globalForPrisma.prisma = undefined;
  globalForPrisma.poolKey = undefined;
}

function getPrisma(): PrismaClient {
  const connectionString = assertDatabaseUrl();

  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prisma &&
    globalForPrisma.poolKey !== devPoolKey(connectionString)
  ) {
    disposeDevClient();
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient(connectionString);
  }

  return globalForPrisma.prisma;
}

/**
 * Proxy para que, al cambiar DATABASE_URL en dev (hot reload de .env), no se reutilice
 * un Pool antiguo apuntando a otra base (p. ej. 127.0.0.1 tras migrar a Supabase).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver) as unknown;
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
}) as PrismaClient;
