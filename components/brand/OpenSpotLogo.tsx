import Link from "next/link";

import { OpenSpotMark } from "@/components/brand/OpenSpotMark";

interface OpenSpotLogoProps {
  className?: string;
  /** Altura del icono en px */
  iconSize?: number;
  showWordmark?: boolean;
  /** Si es false, solo bloque estático (p. ej. cabecera de login) */
  linkToHome?: boolean;
}

export function OpenSpotLogo({
  className = "",
  iconSize = 28,
  showWordmark = true,
  linkToHome = true,
}: OpenSpotLogoProps) {
  const inner = (
    <>
      <OpenSpotMark size={iconSize} className="shrink-0" />
      {showWordmark ? (
        <span className="text-[17px] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          OpenSpot
        </span>
      ) : null}
    </>
  );

  const combinedClass = `inline-flex items-center gap-2.5 ${className}`;

  if (linkToHome) {
    return (
      <Link
        href="/"
        className={`${combinedClass} group rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]`}
        aria-label="OpenSpot — inicio"
      >
        {inner}
      </Link>
    );
  }

  return <span className={combinedClass}>{inner}</span>;
}
