"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Imagen de cabecera / card del blog con contenedor dimensionado y fallback si la URL falla.
 */
export function BlogCoverImage({ src, alt, sizes, priority, className }: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900"
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center text-[13px] font-medium text-white/35">OpenSpot</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      quality={85}
      onError={() => setBroken(true)}
    />
  );
}
