import type { Metadata } from "next";

/** Canonical relativo a `metadataBase` (layout raíz). */
export function withCanonical(path: string): Pick<Metadata, "alternates"> {
  return { alternates: { canonical: path } };
}
