"use client";

import { useId } from "react";

interface OpenSpotMarkProps {
  className?: string;
  size?: number;
  variant?: "gradient" | "mono";
}

/**
 * Monograma OpenSpot: anillo O con apertura + S contemporánea alineada al flujo.
 */
export function OpenSpotMark({
  className = "",
  size = 32,
  variant = "gradient",
}: OpenSpotMarkProps) {
  const rawId = useId().replace(/:/g, "");
  const gradId = `os-grad-${rawId}`;
  const stroke = variant === "mono" ? "currentColor" : `url(#${gradId})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="2"
          y1="4"
          x2="38"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f46e5" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* O: círculo casi cerrado, hueco hacia la S (rotado para equilibrio óptico) */}
      <circle
        cx="16.5"
        cy="20"
        r="10.25"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="54 14"
        transform="rotate(-28 16.5 20)"
      />
      {/* S: trazo único, mismo grosor */}
      <path
        d="M 25.5 11.5 C 31.2 11.5 34.2 14.8 34.2 18.2 C 34.2 21.2 32.1 23.4 28.8 24.1 C 32.4 24.8 34.8 27.4 34.8 30.8 C 34.8 34.6 31.5 37.8 26.2 37.8 C 22.8 37.8 20.2 36.6 18.6 34.8"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
