import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Evita que Google indexe deployments *.vercel.app (contenido duplicado). */
export function middleware(_request: NextRequest) {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|webp|svg|gif|webmanifest)$).*)"],
};
