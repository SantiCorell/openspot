"use client";

import NextTopLoader from "nextjs-toploader";

import { CookieConsent } from "@/components/layout/CookieConsent";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#4f46e5"
        height={3}
        showSpinner={false}
        shadow="0 0 12px rgba(79,70,229,0.35)"
      />
      {children}
      <CookieConsent />
    </>
  );
}
